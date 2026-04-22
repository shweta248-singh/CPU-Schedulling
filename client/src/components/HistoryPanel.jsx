import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X } from 'lucide-react';

const HistoryPanel = ({ isOpen, onClose, historyData }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm glass-panel border-l border-zinc-800 z-50 overflow-y-auto"
            style={{ borderRadius: 0 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <History className="text-zinc-400 w-5 h-5" />
                  <h2 className="text-xl font-bold text-white tracking-tight">History</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 bg-zinc-900/80 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="text-zinc-400 w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {historyData && historyData.length > 0 ? (
                  historyData.map((item, idx) => (
                    <div key={item._id || idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-blue-400 font-mono tracking-wider">
                          {item.algorithm} {item.algorithm === 'RR' ? `(TQ: ${item.timeQuantum})` : ''}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-zinc-950 p-2 rounded">
                          <span className="block text-[10px] uppercase mb-1 opacity-60">Avg TAT</span>
                          <span className="text-purple-300 font-mono">{item.averageTurnaroundTime.toFixed(2)}</span>
                        </div>
                        <div className="bg-zinc-950 p-2 rounded">
                          <span className="block text-[10px] uppercase mb-1 opacity-60">Avg WT</span>
                          <span className="text-orange-300 font-mono">{item.averageWaitingTime.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-zinc-500 py-10 mt-10 border border-dashed border-zinc-800 rounded-xl">
                    <History className="w-8 h-8 opacity-20 mx-auto mb-3" />
                    <p className="text-sm">No simulation history found.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistoryPanel;
