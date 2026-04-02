import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { generateAIInsights, checkOllamaStatus } from '../lib/ollamaService';

export default function AIInsights() {
  const { processedData } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insight, setInsight] = useState('');
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);

  useEffect(() => {
    const pingOllama = async () => {
      const available = await checkOllamaStatus();
      setIsOllamaAvailable(available);
    };
    pingOllama();
  }, []);

  const handleGenerate = async () => {
    if (!processedData) return;
    setLoading(true);
    setError(null);
    try {
      const response = await generateAIInsights(processedData, 'llama3');
      setInsight(response);
    } catch (err) {
      setError('Could not connect to Ollama. Make sure it is running locally and OLLAMA_ORIGINS is set to "*".');
    } finally {
      setLoading(false);
    }
  };

  if (!processedData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container rounded-lg border border-outline-variant/10 mt-8">
        <h2 className="text-xl font-bold mb-2">No Data Available</h2>
        <p className="text-sm text-on-surface-variant mb-6">Upload a dataset first to enable AI analysis.</p>
        <Link to="/" className="text-primary hover:underline">Go to Import</Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20 mt-4 md:mt-10">
      
      {/* Header */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-12 h-1 bg-primary"></span>
            <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase">Intelligence Engine</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-on-background mb-4 uppercase">AI Analyst</h2>
          <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed font-light">
             Powered by a local Llama 3 instance to provide high-level strategic summaries based on your Mental Availability survey data.
          </p>
        </div>
        
        <div className="bg-surface p-6 border border-primary/10 rounded-sm flex items-center gap-6 shadow-lg">
           {!isOllamaAvailable && (
             <div className="flex items-center gap-2 text-error text-[10px] font-bold uppercase mr-4">
                <span className="material-symbols-outlined text-sm">warning</span> Ollama Not Connected
             </div>
           )}
           <button 
             onClick={handleGenerate}
             disabled={loading}
             className={`px-8 py-3 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 duration-200 ${loading ? 'bg-outline text-on-surface' : 'bg-primary text-on-primary hover:bg-secondary'}`}
           >
             {loading ? 'Analyzing Data...' : 'Generate AI Insights'}
           </button>
        </div>
      </section>

      {/* Main Insight Section */}
      <div className="bg-surface-container-low p-8 rounded-sm border border-outline-variant/10 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center gap-4">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p className="text-on-surface-variant text-sm font-medium animate-pulse">Running local inference on Llama 3...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center gap-4 text-error">
             <span className="material-symbols-outlined text-4xl">error</span>
             <h3 className="text-lg font-bold">Ollama Connectivity Issue</h3>
             <p className="max-w-md text-sm">{error}</p>
             <div className="bg-black/20 p-4 rounded text-left font-mono text-[11px] text-on-surface-variant mt-2 border border-outline-variant/10">
                # Set this in PowerShell and restart Ollama:<br/>
                $env:OLLAMA_ORIGINS="*"; ollama serve
             </div>
          </div>
        ) : insight ? (
          <div className="prose prose-invert max-w-none">
             <div className="flex items-center gap-2 mb-8 text-primary font-bold text-xs uppercase tracking-widest border-b border-primary/20 pb-4">
               <span className="material-symbols-outlined text-sm">auto_awesome</span> Strategic Summary Generated
             </div>
             {/* Simple markdown-like rendering of paragraphs/headings */}
             <div className="space-y-6 text-on-surface-variant font-['Inter'] leading-relaxed">
                {insight.split('\n').filter(Boolean).map((line, i) => {
                  if (line.startsWith('# ')) return <h2 key={i} className="text-2xl font-black text-on-surface uppercase italic mt-8 border-b border-outline-variant/20 pb-2">{line.replace('# ', '')}</h2>;
                  if (line.startsWith('## ')) return <h3 key={i} className="text-xl font-bold text-primary italic mt-6">{line.replace('## ', '')}</h3>;
                  if (line.startsWith('- ')) return <li key={i} className="list-disc ml-5 mb-2">{line.replace('- ', '')}</li>;
                  return <p key={i}>{line}</p>;
                })}
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center gap-6 text-outline">
             <span className="material-symbols-outlined text-6xl opacity-20">psychology</span>
             <div>
                <h3 className="text-lg font-bold opacity-30">AI Analysis Ready</h3>
                <p className="text-xs opacity-30 mt-1 uppercase tracking-widest font-black">Click generate to start the analysis engine</p>
             </div>
          </div>
        )}
      </div>

    </div>
  );
}
