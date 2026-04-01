import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { calculateMetrics } from '../lib/metrics';
import MetricInfo from '../components/MetricInfo';

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

  const handleExport = () => {
    const headers = ['Brand', 'Mental Penetration (%)', 'Network Size', 'Mental Market Share (%)'];
    const rows = sortedMetrics.map(m => [
      m.brand,
      m.mPen.toFixed(1),
      m.networkSize.toFixed(2),
      m.mms.toFixed(1),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brand_performance.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 mt-4 md:mt-10">
      
      {/* Header Section with Asymmetry */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <p className="text-secondary font-label text-xs uppercase tracking-[0.2em] mb-2">Brand Performance Overview</p>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Executive Summary</h2>
          <p className="mt-4 text-on-surface-variant max-w-2xl font-body leading-relaxed">
            Key metrics across all brands — Mental Penetration, Network Size, and Mental Market Share — ranked by share of mind.
          </p>
        </div>
      </div>
      
      {/* Key Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container p-5 rounded">
          <div className="mb-2">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant inline-flex items-center">Avg Mental Penetration<MetricInfo text="% of all respondents who linked at least one brand to a CEP. Averaged across all brands in this dataset." /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold tracking-tight">{avgPen}%</span>
          </div>
        </div>
        
        <div className="bg-surface-container p-5 rounded">
          <div className="mb-2">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant inline-flex items-center">Average Network Size<MetricInfo text="Average number of CEPs linked to a brand by those who mentioned it. Measures breadth of mental associations." /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold tracking-tight">{avgNS}</span>
          </div>
        </div>
        
        <div className="bg-surface-container p-5 rounded">
          <div className="mb-2">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Total Respondents</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline font-bold tracking-tight">{processedData.totalRespondents}</span>
          </div>
        </div>
        
        <div className="bg-surface-container p-5 rounded border-l-2 border-secondary">
          <div className="mb-2">
            <span className="text-xs font-label uppercase tracking-widest text-secondary">Brands Analyzed</span>
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
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">{sortedMetrics.length} Brands · {processedData.totalRespondents} Respondents</span>
            <button onClick={handleExport} className="bg-primary hover:bg-secondary text-on-primary px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 duration-200">
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50">
                <th className="py-4 px-6 text-[10px] font-bold text-outline uppercase tracking-widest whitespace-nowrap">Brand</th>
                <th className="py-4 px-6 text-[10px] font-bold text-outline uppercase tracking-widest whitespace-nowrap"><span className="inline-flex items-center">Mental Penetration<MetricInfo text="% of all respondents who linked this brand to at least one CEP. Higher = more people have this brand in mind." /></span></th>
                <th className="py-4 px-6 text-[10px] font-bold text-outline uppercase tracking-widest whitespace-nowrap"><span className="inline-flex items-center">Network Size<MetricInfo text="Average number of CEPs linked to this brand by those who mentioned it. Higher = richer, broader mental associations." /></span></th>
                <th className="py-4 px-6 text-[10px] font-bold text-outline uppercase tracking-widest whitespace-nowrap"><span className="inline-flex items-center">Mental Market Share<MetricInfo text="This brand's share of all associations in the category. A proxy for dominance of mental space relative to all competitors." /></span></th>
              </tr>
            </thead>
            <tbody className="font-body text-sm divide-y divide-outline-variant/5">
              {sortedMetrics.map((m, idx) => {
                const colorConfig = [
                  {bg:'bg-primary-container/20', text:'text-primary', code:'var(--primary)'},
                  {bg:'bg-tertiary/10', text:'text-tertiary', code:'var(--tertiary)'},
                  {bg:'bg-secondary/10', text:'text-secondary', code:'var(--secondary)'},
                  {bg:'bg-outline/10', text:'text-outline', code:'var(--outline-variant)'}
                ];
                const theme = colorConfig[idx % colorConfig.length];

                return (
                  <tr key={m.brand} className={`hover:bg-surface-container-highest transition-colors ${idx === 0 ? 'bg-primary-container/10 border-l-2 border-primary' : ''}`}>
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
                    <td className="py-5 px-6 min-w-[200px]">
                      <div className={`flex items-center gap-4 ${theme.text}`}>
                        <span className="font-mono w-12">{m.mms.toFixed(1)}</span>
                        <div className="flex-1 min-w-[100px] h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${maxMMS > 0 ? (m.mms / maxMMS) * 100 : 0}%`, backgroundColor: theme.code }}></div>
                        </div>
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
