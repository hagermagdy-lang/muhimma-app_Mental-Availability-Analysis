import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';

export default function CEPGrid() {
  const { processedData } = useOutletContext();

  if (!processedData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container rounded-lg border border-outline-variant/10 mt-8">
        <h2 className="text-xl font-bold mb-2">No Data Available</h2>
        <p className="text-sm text-on-surface-variant mb-6">Return to the Import page to load a dataset.</p>
        <Link to="/" className="text-primary hover:underline">Go to Import</Link>
      </div>
    );
  }

  const { brands, ceps, summary } = processedData;
  const filteredCeps = ceps.filter(Boolean);

  // Helper for cell styling
  const getCellColor = (percent, brandIndex) => {
    const isPrimary = brandIndex % 2 === 0;
    const baseColor = isPrimary ? 'bg-primary' : 'bg-secondary';
    
    if (percent > 70) return `${baseColor} text-on-primary font-black`;
    if (percent > 40) return `${baseColor}/60 text-white font-bold`;
    if (percent > 15) return `${baseColor}/20 text-white font-medium`;
    return `bg-surface-container text-on-surface-variant font-medium`; // ~0%
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 mt-4 md:mt-10">
      
      {/* Header & Controls */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-12 h-1 bg-primary"></span>
            <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase">Performance Analysis</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-on-background mb-4 uppercase">CEP Associations</h2>
          <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed font-light">
            Analyzing Category Entry Point (CEP) strength across core brand assets. Identifying white space opportunities and competitive overlaps based on actual imported dataset telemetry.
          </p>
        </div>
        <div className="bg-surface p-6 border border-primary/10 rounded-sm flex items-center gap-6 shadow-lg">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">Grid View Mode</span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white">Standard</span>
              <button className="relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center rounded-sm bg-outline transition-colors focus:outline-none">
                <span className="translate-x-5 inline-block h-4 w-4 transform rounded-sm bg-primary transition duration-200"></span>
              </button>
              <span className="text-xs font-bold text-primary">Show Delta</span>
            </div>
          </div>
          <div className="h-10 w-px bg-primary/20"></div>
          <button className="bg-primary hover:bg-secondary text-on-primary px-6 py-2.5 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 duration-200">
            Export .CSV
          </button>
        </div>
      </section>

      {/* The Grid & Heatmap */}
      <div className="grid grid-cols-12 gap-1 border border-primary/5">
        
        {/* Sidebar: Brand Labels */}
        <div className="col-span-12 md:col-span-2 bg-surface-container-low p-6 flex flex-col justify-end min-h-[160px]">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mb-6">Asset Cluster</h3>
            <div className={`space-y-4 flex flex-col justify-end`} style={{ minHeight: `${brands.length * 6}rem` }}>
              {brands.map((b, i) => (
                <div key={b} className="group cursor-pointer h-16 flex flex-col justify-center">
                  <span className="block text-sm font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight truncate">{b}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-widest opacity-60 truncate">Index {i+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Scrollable Area */}
        <div className="col-span-12 md:col-span-10 overflow-x-auto bg-surface-container-lowest">
          <div className="min-w-max">
            
            {/* Column Headers */}
            <div className="flex border-b border-primary/10">
              {filteredCeps.map((cep, idx) => (
                <div key={cep} className={`p-6 text-center border-r border-primary/10 w-40 flex-shrink-0 ${idx % 2 === 0 ? 'bg-surface-container-low/30' : ''}`}>
                  <span className="material-symbols-outlined text-primary block mb-3 text-2xl truncate" title={cep}>
                     {['celebration', 'dark_mode', 'fastfood', 'work', 'fitness_center', 'family_restroom'][idx % 6]}
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white block truncate" title={cep}>{cep}</span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {brands.map((b, i) => {
              const bData = summary[b];
              const total = bData.totalAssociations;

              return (
                <div key={b} className="flex h-16 border-b border-background">
                  {filteredCeps.map(cep => {
                    const count = bData.cepCounts[cep] || 0;
                    const percent = processedData.totalRespondents > 0 ? (count / processedData.totalRespondents) * 100 : 0;
                    const cellColor = getCellColor(percent, i);

                    return (
                      <div key={cep} className={`relative flex items-center justify-center text-xl w-40 flex-shrink-0 border-r border-background ${cellColor}`}>
                        {percent.toFixed(0)}%
                        <div className="absolute top-2 right-2 text-[9px] font-bold opacity-70">
                           {count} {percent > 10 ? 'obs' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Metric Sparkline Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 mb-8">
        <div className="bg-surface-container-low p-6 border-l-2 border-primary">
          <span className="text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em]">Avg. Linkages</span>
          <div className="flex items-end justify-between mt-3">
            <span className="text-4xl font-black tracking-tighter text-white">{filteredCeps.length}</span>
            <div className="flex items-center gap-1 text-primary text-xs font-black uppercase">
               CEPs Total
            </div>
          </div>
          <div className="mt-6 h-1.5 w-full bg-outline-variant overflow-hidden">
            <div className="h-full bg-primary w-[100%]"></div>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 border-l-2 border-secondary">
          <span className="text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em]">Matrix Load</span>
          <div className="flex items-end justify-between mt-3">
            <span className="text-4xl font-black tracking-tighter text-white">{processedData.totalCategoryAssociations}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-on-surface-variant font-medium">Data Points Mapped</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 border-l-2 border-primary">
          <span className="text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em]">Dominant Space</span>
          <div className="flex items-end justify-between mt-3">
            <span className="text-2xl font-black tracking-tighter text-white truncate max-w-[80%]">
               {brands.length > 0 ? brands.reduce((a, b) => summary[a].totalAssociations >= summary[b].totalAssociations ? a : b) : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-primary font-black uppercase tracking-widest">HIGHEST OVERLAP</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 border-l-2 border-primary">
          <span className="text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em]">Data Freshness</span>
          <div className="flex items-center gap-3 mt-3">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary animate-pulse"></span>
            <span className="text-sm font-black text-white uppercase tracking-tighter">Real-Time Sync</span>
          </div>
          <p className="text-[10px] text-on-surface-variant mt-3 uppercase tracking-widest font-medium">Survey Parsed Successfully</p>
        </div>
      </div>

    </div>
  );
}
