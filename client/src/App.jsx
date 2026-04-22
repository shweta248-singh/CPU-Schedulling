import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, History as HistoryIcon } from 'lucide-react';
import ProcessInputForm from './components/ProcessInputForm';
import GanttChart from './components/GanttChart';
import StatsTable from './components/StatsTable';
import HistoryPanel from './components/HistoryPanel';
import { motion } from 'framer-motion';

const App = () => {
  const [resultData, setResultData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/history');
      setHistoryData(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSimulate = async (data) => {
    setIsSimulating(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5001/api/simulate', data);
      setResultData(res.data);
      // Refresh history silently
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred during simulation');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full point-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full point-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg ring-1 ring-white/10">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl tracking-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-purple-200">
                CPU Scheduler
              </h1>
              <p className="text-sm font-medium text-zinc-400 mt-1">Algorithm Simulator & Visualizer</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-300 text-sm font-medium"
          >
            <HistoryIcon className="w-4 h-4" />
            View History
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <ProcessInputForm onSimulate={handleSimulate} isSimulating={isSimulating} />
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </div>
          
          <div className="lg:col-span-8 flex flex-col gap-8">
            {resultData ? (
              <>
                <GanttChart data={resultData} />
                <StatsTable data={resultData} />
              </>
            ) : (
              <div className="flex items-center justify-center h-[400px] glass-panel rounded-2xl border border-dashed border-zinc-700">
                <div className="text-center opacity-40">
                  <Activity className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">No Simulation Data</p>
                  <p className="text-sm">Configure processes and click Run Simulation.</p>
                </div>
              </div>
            )}
          </div>
        </main>

        <HistoryPanel 
          isOpen={showHistory} 
          onClose={() => setShowHistory(false)} 
          historyData={historyData}
        />
      </div>
    </div>
  );
};

export default App;
