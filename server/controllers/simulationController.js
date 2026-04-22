const Simulation = require('../models/Simulation');

const fcfs = (processes) => {
    let p = [...processes].map(proc => ({...proc}));
    p.sort((a, b) => a.arrivalTime - b.arrivalTime);
    let time = 0;
    let ganttChart = [];
    
    p.forEach(proc => {
        if (time < proc.arrivalTime) {
            ganttChart.push({ processId: 'IDLE', startTime: time, endTime: proc.arrivalTime });
            time = proc.arrivalTime;
        }
        ganttChart.push({ processId: proc.id, startTime: time, endTime: time + proc.burstTime });
        time += proc.burstTime;
        proc.completionTime = time;
        proc.turnaroundTime = proc.completionTime - proc.arrivalTime;
        proc.waitingTime = proc.turnaroundTime - proc.burstTime;
    });

    return { processes: p, ganttChart };
};

const sjf = (processes) => {
    let p = [...processes].map(proc => ({...proc}));
    let time = 0;
    let ganttChart = [];
    let completed = 0;
    
    while(completed < p.length) {
        let available = p.filter(proc => proc.arrivalTime <= time && proc.completionTime === undefined);
        if (available.length === 0) {
            let nextArrival = Math.min(...p.filter(pr => pr.completionTime === undefined).map(pr => pr.arrivalTime));
            ganttChart.push({ processId: 'IDLE', startTime: time, endTime: nextArrival });
            time = nextArrival;
            continue;
        }
        available.sort((a, b) => {
            if (a.burstTime === b.burstTime) return a.arrivalTime - b.arrivalTime;
            return a.burstTime - b.burstTime;
        });
        let proc = available[0];
        ganttChart.push({ processId: proc.id, startTime: time, endTime: time + proc.burstTime });
        time += proc.burstTime;
        
        proc.completionTime = time;
        proc.turnaroundTime = proc.completionTime - proc.arrivalTime;
        proc.waitingTime = proc.turnaroundTime - proc.burstTime;
        completed++;
    }
    return { processes: p, ganttChart };
};

const srtf = (processes) => {
    let p = [...processes].map(proc => ({...proc, remainingTime: proc.burstTime}));
    let time = 0;
    let ganttChart = [];
    let completed = 0;

    const recordGantt = (pid, start, end) => {
        if(start === end) return;
        if(ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === pid) {
            ganttChart[ganttChart.length - 1].endTime = end;
        } else {
            ganttChart.push({ processId: pid, startTime: start, endTime: end });
        }
    };

    while(completed < p.length) {
        let available = p.filter(proc => proc.arrivalTime <= time && proc.remainingTime > 0);
        
        if (available.length === 0) {
            let nextArrival = Math.min(...p.filter(pr => pr.remainingTime > 0).map(pr => pr.arrivalTime));
            recordGantt('IDLE', time, nextArrival);
            time = nextArrival;
            continue;
        }
        
        available.sort((a, b) => {
            if (a.remainingTime === b.remainingTime) return a.arrivalTime - b.arrivalTime;
            return a.remainingTime - b.remainingTime;
        });
        
        let proc = available[0];
        let nextArrivals = p.filter(pr => pr.arrivalTime > time && pr.remainingTime > 0).map(pr => pr.arrivalTime);
        let nextTime = nextArrivals.length > 0 ? Math.min(...nextArrivals) : Infinity;
        
        if (time + proc.remainingTime <= nextTime) {
            recordGantt(proc.id, time, time + proc.remainingTime);
            time += proc.remainingTime;
            proc.remainingTime = 0;
            proc.completionTime = time;
            proc.turnaroundTime = proc.completionTime - proc.arrivalTime;
            proc.waitingTime = proc.turnaroundTime - proc.burstTime;
            completed++;
        } else {
            recordGantt(proc.id, time, nextTime);
            proc.remainingTime -= (nextTime - time);
            time = nextTime;
        }
    }
    
    p.forEach(proc => delete proc.remainingTime);
    return { processes: p, ganttChart };
};

const rr = (processes, quantum) => {
    let p = [...processes].map(proc => ({...proc, remainingTime: proc.burstTime}));
    let time = 0;
    let ganttChart = [];
    let completed = 0;
    let queue = [];
    let inQueue = new Set();
    
    let timeProcesses = p.filter(proc => proc.arrivalTime <= time);
    timeProcesses.sort((a,b) => a.arrivalTime - b.arrivalTime);
    timeProcesses.forEach(proc => {queue.push(proc); inQueue.add(proc.id);});
    
    const recordGantt = (pid, start, end) => {
        if(start === end) return;
        if(ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === pid) {
            ganttChart[ganttChart.length - 1].endTime = end;
        } else {
            ganttChart.push({ processId: pid, startTime: start, endTime: end });
        }
    };

    while(completed < p.length) {
        if (queue.length === 0) {
            let pending = p.filter(pr => pr.remainingTime > 0);
            if(pending.length > 0) {
                let nextArrival = Math.min(...pending.map(pr => pr.arrivalTime));
                recordGantt('IDLE', time, nextArrival);
                time = nextArrival;
                let newProcs = p.filter(proc => proc.arrivalTime <= time && proc.remainingTime > 0 && !inQueue.has(proc.id));
                newProcs.sort((a,b) => a.arrivalTime - b.arrivalTime);
                newProcs.forEach(proc => {queue.push(proc); inQueue.add(proc.id);});
            } else {
                break;
            }
        }
        
        let proc = queue.shift();
        inQueue.delete(proc.id);
        
        let execTime = Math.min(quantum, proc.remainingTime);
        recordGantt(proc.id, time, time + execTime);
        time += execTime;
        proc.remainingTime -= execTime;
        
        let newProcs = p.filter(pr => pr.arrivalTime > time - execTime && pr.arrivalTime <= time && pr.remainingTime > 0 && !inQueue.has(pr.id) && pr.id !== proc.id);
        newProcs.sort((a,b) => a.arrivalTime - b.arrivalTime);
        newProcs.forEach(pr => {queue.push(pr); inQueue.add(pr.id);});
        
        if (proc.remainingTime > 0) {
            queue.push(proc);
            inQueue.add(proc.id);
        } else {
            proc.completionTime = time;
            proc.turnaroundTime = proc.completionTime - proc.arrivalTime;
            proc.waitingTime = proc.turnaroundTime - proc.burstTime;
            completed++;
        }
    }
    p.forEach(proc => delete proc.remainingTime);
    return { processes: p, ganttChart };
};

exports.simulate = async (req, res) => {
    try {
        const { algorithm, timeQuantum, processes } = req.body;
        
        let result;
        switch(algorithm) {
            case 'FCFS':
                result = fcfs(processes);
                break;
            case 'SJF':
                result = sjf(processes);
                break;
            case 'SRTF':
                result = srtf(processes);
                break;
            case 'RR':
                result = rr(processes, Number(timeQuantum) || 2);
                break;
            default:
                return res.status(400).json({ message: 'Invalid algorithm' });
        }

        const avgWT = result.processes.reduce((acc, p) => acc + p.waitingTime, 0) / result.processes.length;
        const avgTAT = result.processes.reduce((acc, p) => acc + p.turnaroundTime, 0) / result.processes.length;

        const simulation = new Simulation({
            algorithm,
            timeQuantum: algorithm === 'RR' ? timeQuantum : null,
            processes: result.processes,
            ganttChart: result.ganttChart,
            averageWaitingTime: avgWT,
            averageTurnaroundTime: avgTAT
        });

        await simulation.save();

        res.status(201).json(simulation);
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ message: 'Server error during simulation' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await Simulation.find().sort({ createdAt: -1 }).limit(20);
        res.json(history);
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ message: 'Server error fetching history' });
    }
};
