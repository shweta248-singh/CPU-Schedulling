import React from 'react';
import { motion } from 'framer-motion';
import { TableProperties } from 'lucide-react';

const colorPalette = [
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
];

const getProcessColor = (pid) => {
  if (pid === 'IDLE') return 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50';
  const num = parseInt(pid.replace(/\D/g, '')) || 0;
  return colorPalette[num % colorPalette.length];
};

const StatsTable = ({ data }) => {
  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-6 flex flex-col gap-6"
    >
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <TableProperties className="text-emerald-400 w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-white">Process Details</h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-semibold">Process</th>
              <th className="px-4 py-3 font-semibold text-center">AT</th>
              <th className="px-4 py-3 font-semibold text-center">BT</th>
              <th className="px-4 py-3 font-semibold text-center">CT</th>
              <th className="px-4 py-3 font-semibold text-center">TAT</th>
              <th className="px-4 py-3 font-semibold text-center">WT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {data.processes.map((proc, index) => (
              <tr key={index} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold border ${getProcessColor(proc.id)}`}>
                    {proc.id}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-zinc-300 font-mono">{proc.arrivalTime}</td>
                <td className="px-4 py-3 text-center text-zinc-300 font-mono">{proc.burstTime}</td>
                <td className="px-4 py-3 text-center text-white font-mono">{proc.completionTime}</td>
                <td className="px-4 py-3 text-center text-purple-300 font-mono">{proc.turnaroundTime}</td>
                <td className="px-4 py-3 text-center text-orange-300 font-mono">{proc.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Avg Turnaround Time</span>
          <span className="text-2xl font-bold text-white font-mono">{data.averageTurnaroundTime.toFixed(2)}</span>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Avg Waiting Time</span>
          <span className="text-2xl font-bold text-white font-mono">{data.averageWaitingTime.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsTable;
