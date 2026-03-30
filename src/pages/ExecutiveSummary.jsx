import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { calculateMetrics } from '../lib/metrics';

export default function ExecutiveSummary() {
  const { processedData } = useOutletContext();
  
  const metrics = useMemo(() => {
    if (!processedData) return null;
    return calculateMetrics(processedData);
  }, [processedData]);

  if (!metrics) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center p-8 text-center bg-surface-container rounded-lg border border-outline-variant/10 mt-8">
        <span className="material-symbols-outlined text-4xl text-outline-variant mb-4" data-icon="storage">storage</span>
        <h2 className="text-xl font-bold text-on-surface mb-2">No Data Available</h2>
        <p className="text-sm text-on-surface-variant max-w-sm mb-6">Please upload a valid survey CSV from the import screen to view the executive summary.</p>
      </div>
    );
  }

  // Aggregate metrics
  const totalNS = metrics.reduce((sum, m) => sum + m.networkSize, 0);
  const avgNS = (totalNS / metrics.length).toFixed(2);
  const totalPen = metrics.reduce((sum, m) => sum + m.mPen, 0);
  const avgPen = (totalPen / metrics.length).toFixed(1);
  const maxMMS = Math.max(...metrics.map(m => m.mms));
  const sortedMetrics = [...metrics].sort((a, b) => b.mms - a.mms);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 mt-4 md:mt-10">
      
      {/* Header Section with Asymmetry */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <p className="text-secondary font-label text-xs uppercase tracking-[0.2em] mb-2">Market Intelligence Output</p>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Executive Summary</h2>
          <p className="mt-4 text-on-surface-variant max-w-2xl font-body leading-relaxed">
            Analyzing brand strength across mental market share and purchase penetration. Data reflects dynamically parsed respondent associations.
          </p>
        </div>
      </div>
      
      {/* Key Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container p-5 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Avg Category M-Pen</span>
            <span className="material-symbols-outlined text-secondary text-sm" data-icon="trending_up">trending_up</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold tracking-tight">{avgPen}%</span>
          </div>
        </div>
        
        <div className="bg-surface-container p-5 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Average Network Size</span>
            <span className="material-symbols-outlined text-outline-variant text-sm" data-icon="hub">hub</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold tracking-tight">{avgNS}</span>
          </div>
        </div>
        
        <div className="bg-surface-container p-5 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Total Respondents</span>
            <span className="material-symbols-outlined text-tertiary text-sm" data-icon="groups">groups</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold tracking-tight">{processedData.totalRespondents}</span>
          </div>
        </div>
        
        <div className="bg-surface-container p-5 rounded border-l-2 border-secondary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-label uppercase tracking-widest text-secondary">Brands Analyzed</span>
            <span className="material-symbols-outlined text-secondary text-sm" data-icon="analytics">analytics</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold tracking-tight text-secondary">{metrics.length}</span>
            <span className="text-on-surface-variant text-xs">Brands</span>
          </div>
        </div>
      </div>
      
      {/* Main Data Table Container */}
      <div className="bg-surface-container-low rounded overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">Brand Performance Index</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Live Updates Enabled</span>
          </div>
        </div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50">
                <th className="py-4 px-6 text-[10px] font-bold text-outline uppercase tracking-widest whitespace-nowrap">Brand Identifier</th>
                <th className="py-4 px-6 text-[10px] font-bold text-outline uppercase tracking-widest whitespace-nowrap">MPen (%)</th>
                <th className="py-4 px-6 text-[10px] font-bold text-outline uppercase tracking-widest whitespace-nowrap">NS (Avg)</th>
                <th className="py-4 px-6 text-[10px] font-bold text-outline uppercase tracking-widest whitespace-nowrap">MMS (%)</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm divide-y divide-outline-variant/5">
              {metrics.sort((a,b) => b.mms - a.mms).map((m, idx) => {
                const colorConfig = [
                  {bg:'bg-primary-container/20', text:'text-primary', code:'var(--primary)'},
                  {bg:'bg-tertiary/10', text:'text-tertiary', code:'var(--tertiary)'},
                  {bg:'bg-secondary/10', text:'text-secondary', code:'var(--secondary)'},
                  {bg:'bg-outline/10', text:'text-outline', code:'var(--outline-variant)'}
                ];
                const theme = colorConfig[idx % colorConfig.length];

                return (
                  <tr key={m.brand} className="hover:bg-surface-container-highest transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded ${theme.bg} flex items-center justify-center ${theme.text}`}>
                           <span className="font-bold">{idx + 1}</span>
                        </div>
                        <span className="font-bold text-on-surface whitespace-nowrap">{m.brand}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 min-w-[200px]">
                      <div className="flex items-center gap-4">
                        <span className="font-mono w-12">{m.mPen.toFixed(1)}</span>
                        <div className="flex-1 min-w-[100px] h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className={`h-full bg-secondary rounded-full`} style={{ width: `${m.mPen}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 font-mono text-on-surface-variant">
                      {m.networkSize.toFixed(2)}
                    </td>
                    <td className="py-5 px-6">
                      <div className={`flex items-center gap-2 ${theme.text}`}>
                        <span className="font-mono">{m.mms.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
