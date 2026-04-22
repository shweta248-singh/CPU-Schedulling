import React, { useState } from 'react';
import { Plus, Trash2, Cpu, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProcessInputForm = ({ onSimulate, isSimulating }) => {
  const [processes, setProcesses] = useState([
    { id: 'P1', arrivalTime: 0, burstTime: 5 },
    { id: 'P2', arrivalTime: 1, burstTime: 3 },
    { id: 'P3', arrivalTime: 2, burstTime: 8 },
  ]);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(2);

  const handleAddProcess = () => {
    setProcesses([
      ...processes,
      { id: `P${processes.length + 1}`, arrivalTime: 0, burstTime: 1 }
    ]);
  };

  const handleRemoveProcess = (index) => {
    if (processes.length <= 1) return;
    const newProcesses = processes.filter((_, i) => i !== index);
    setProcesses(newProcesses);
  };

  const handleProcessChange = (index, field, value) => {
    const newProcesses = [...processes];
    newProcesses[index][field] = Number(value) >= 0 ? Number(value) : 0;
    setProcesses(newProcesses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSimulate({ algorithm, timeQuantum, processes });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Cpu className="text-blue-400 w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-white">Simulation Config</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm text-zinc-400 font-medium">Algorithm</label>
            <div className="relative">
              <select 
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="glass-input appearance-none cursor-pointer"
              >
                <option value="FCFS" className="bg-zinc-900 text-white">First Come First Serve (FCFS)</option>
                <option value="SJF" className="bg-zinc-900 text-white">Shortest Job First (SJF)</option>
                <option value="SRTF" className="bg-zinc-900 text-white">Shortest Remaining Time First (SRTF)</option>
                <option value="RR" className="bg-zinc-900 text-white">Round Robin (RR)</option>
              </select>
            </div>
          </div>
          
          <AnimatePresence>
            {algorithm === 'RR' && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="w-full sm:w-32 space-y-2 overflow-hidden"
              >
                <label className="text-sm text-zinc-400 font-medium whitespace-nowrap">Time Quantum</label>
                <input 
                  type="number" 
                  min="1"
                  value={timeQuantum}
                  onChange={(e) => setTimeQuantum(e.target.value)}
                  className="glass-input"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm text-zinc-400 font-medium">Processes</label>
            <button 
              type="button" 
              onClick={handleAddProcess}
              className="text-xs flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Process
            </button>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            <AnimatePresence>
              {processes.map((proc, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800"
                >
                  <div className="w-12 text-center font-mono text-zinc-400 text-sm font-semibold selection:bg-blue-500/30">
                    {proc.id}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 ml-1">Arrival</span>
                      <input 
                        type="number" min="0" value={proc.arrivalTime}
                        onChange={(e) => handleProcessChange(index, 'arrivalTime', e.target.value)}
                        className="glass-input !py-1.5 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 ml-1">Burst</span>
                      <input 
                        type="number" min="1" value={proc.burstTime}
                        onChange={(e) => handleProcessChange(index, 'burstTime', e.target.value)}
                        className="glass-input !py-1.5 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveProcess(index)}
                    disabled={processes.length === 1}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSimulating}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {isSimulating ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Run Simulation
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProcessInputForm;
