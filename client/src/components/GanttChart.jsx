import React from 'react';
import { motion } from 'framer-motion';
import { BarChart } from 'lucide-react';

const colorPalette = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 
  'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500',
];

const getBgColor = (pid) => {
  if (pid === 'IDLE') return 'bg-zinc-800 stripy-bg';
  const num = parseInt(pid.replace(/\D/g, '')) || 0;
  return colorPalette[num % colorPalette.length];
};

const GanttChart = ({ data }) => {
  if (!data || !data.ganttChart || data.ganttChart.length === 0) return null;

  const totalTime = data.ganttChart[data.ganttChart.length - 1].endTime;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-6 flex flex-col gap-6"
    >
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <BarChart className="text-purple-400 w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-white">Gantt Chart</h2>
      </div>

      <div className="relative pt-8 pb-12 w-full overflow-x-auto">
        <div className="min-w-[600px] w-full flex h-24 rounded-lg overflow-hidden border border-zinc-700/50 shadow-inner">
          {data.ganttChart.map((block, index) => {
            const widthPct = ((block.endTime - block.startTime) / totalTime) * 100;
            return (
              <motion.div
                key={index}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: `${widthPct}%`, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative h-full flex items-center justify-center border-r border-black/20 last:border-r-0 ${getBgColor(block.processId)}`}
              >
                <span className="text-white font-bold text-sm tracking-widest drop-shadow-md">
                  {block.processId !== 'IDLE' ? block.processId : ''}
                </span>
                
                {/* Timeline markers */}
                <div className="absolute -bottom-7 left-0 -translate-x-1/2 flex flex-col items-center">
                  <div className="h-2 w-[1px] bg-zinc-600 mb-1" />
                  <span className="text-xs font-mono text-zinc-400">{block.startTime}</span>
                </div>
                
                {/* Final time marker on the last block */}
                {index === data.ganttChart.length - 1 && (
                  <div className="absolute -bottom-7 right-0 translate-x-1/2 flex flex-col items-center">
                    <div className="h-2 w-[1px] bg-zinc-600 mb-1" />
                    <span className="text-xs font-mono text-zinc-400">{block.endTime}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .stripy-bg {
          background-image: repeating-linear-gradient(
            45deg,
            #27272a,
            #27272a 10px,
            #18181b 10px,
            #18181b 20px
          );
        }
      `}} />
    </motion.div>
  );
};

export default GanttChart;
