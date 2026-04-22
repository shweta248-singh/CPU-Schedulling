const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
    id: String,
    arrivalTime: Number,
    burstTime: Number,
    completionTime: Number,
    turnaroundTime: Number,
    waitingTime: Number,
});

const simulationSchema = new mongoose.Schema({
    algorithm: {
        type: String,
        required: true,
        enum: ['FCFS', 'SJF', 'SRTF', 'RR']
    },
    timeQuantum: { type: Number, default: null }, // Only for RR
    processes: [processSchema],
    ganttChart: [{
        processId: String,
        startTime: Number,
        endTime: Number
    }],
    averageWaitingTime: Number,
    averageTurnaroundTime: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Simulation', simulationSchema);
