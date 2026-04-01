import { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { calculateMetrics } from '../lib/metrics';
import MetricInfo from '../components/MetricInfo';

export default function BrandAnalysis() {
  const { processedData } = useOutletContext();
  
  const metrics = useMemo(() => {
    if (!processedData) return null;
    return calculateMetrics(processedData);
  }, [processedData]);

  const [selectedBrand, setSelectedBrand] = useState(
    metrics && metrics.length > 0 ? metrics[0].brand : ''
  );

  if (!metrics || !processedData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container rounded-lg border border-outline-variant/10 mt-8">
        <h2 className="text-xl font-bold mb-2">No Data Available</h2>
        <p className="text-sm text-on-surface-variant mb-6">Return to the Import page to load a dataset.</p>
        <Link to="/" className="text-primary hover:underline">Go to Import</Link>
      </div>
    );
  }

  const currentMetric = metrics.find(m => m.brand === selectedBrand) || metrics[0];
  const { summary } = processedData;

  // Compute CEP strength breakdown for the current brand
  const bData = summary[currentMetric.brand];
  const totalBrandAssociations = bData.totalAssociations;
  
  const cepStrengths = Object.entries(bData.cepCounts)
    .map(([cep, count]) => ({
       cep, 
       percentage: totalBrandAssociations > 0 ? (count / totalBrandAssociations) * 100 : 0
    }))
    .sort((a,b) => b.percentage - a.percentage)
    .slice(0, 4); // Top 4 CEPs

  const avgPen = metrics.reduce((sum,m)=>sum+m.mPen, 0) / metrics.length;
  const avgNs = metrics.reduce((sum,m)=>sum+m.networkSize, 0) / metrics.length;
  const maxNs = Math.max(...metrics.map(m => m.networkSize));
  const avgMms = metrics.reduce((sum,m)=>sum+m.mms, 0) / metrics.length;

  const chartData = [...metrics]
    .sort((a, b) => b.mPen - a.mPen)
    .map(m => ({ name: m.brand, mPen: parseFloat(m.mPen.toFixed(1)) }));

  return (
    <div className="animate-in fade-in duration-500 pb-20 mt-4 md:mt-10">
      
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-3xl font-bold uppercase italic tracking-tighter">Brand Deep Dive</h2>
         <select 
            value={selectedBrand} 
            onChange={e => setSelectedBrand(e.target.value)}
            className="bg-surface-container-high border-none text-on-surface rounded p-2 text-sm max-w-[200px]"
         >
            {metrics.map(m => (
               <option key={m.brand} value={m.brand}>{m.brand}</option>
            ))}
         </select>
      </div>

      {/* Hero Visualization Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <div className="lg:col-span-8 flex flex-col justify-end p-8 bg-surface-container-low rounded-sm relative overflow-hidden h-[340px] border border-outline-variant/10">
          <div className="absolute inset-0 opacity-10">
            <img className="w-full h-full object-cover grayscale brightness-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrmAluRFD9x6II_A1a1GSksJuCd_hXqZ3YBIi0ubBAQGmne9_TAH15fdfyvOsQTGBUe2R_qDaDNaGVGvelSEtLTB_DeNLYBmCnv32gqu1PoDqryatig3mHB2AYt23xFwAxUs8W97prBICoqKg7_EO7RoWJKmqR8F8HSRDpirEHb1pzatlbVhzEtRMmVKbPs7cwEyj5EJ2iU2--MswHNNsbojG9XIUl2Q1hsYg3iD7IYPAL7UBBLYYKmlcH95qmrEMWG8nJshKiEiU" alt="BG" />
          </div>
          <div className="relative z-10">
            <span className="text-secondary font-bold text-[10px] uppercase tracking-[0.2em] mb-3 block">Performance Asset</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface mb-4 uppercase italic">
               {currentMetric.brand} Penetration
            </h2>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-primary tracking-tighter">{currentMetric.mPen.toFixed(1)}%</span>
              <span className="text-secondary flex items-center text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm mr-1">trending_up</span> Live
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
          <div className="bg-surface-container p-6 rounded-sm flex flex-col justify-between border border-outline-variant/10">
            <div>
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Network Size</p>
              <h3 className="text-3xl font-black text-on-surface italic uppercase">{currentMetric.networkSize.toFixed(2)} avg links</h3>
            </div>
            <div className="h-1 w-full bg-surface-container-highest rounded-full mt-6">
              <div className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(243,107,31,0.5)]" style={{ width: `${maxNs > 0 ? Math.min((currentMetric.networkSize / maxNs) * 100, 100) : 0}%` }}></div>
            </div>
          </div>
          
          <div className="bg-surface-container p-6 rounded-sm flex flex-col justify-between border border-outline-variant/10">
            <div>
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] mb-1">MMS Position</p>
              <h3 className="text-3xl font-black text-on-surface italic uppercase">
                {currentMetric.mms >= avgMms * 1.2 ? 'Strong' : currentMetric.mms >= avgMms * 0.8 ? 'Stable' : 'Vulnerable'}
              </h3>
            </div>
            <div className="flex gap-1.5 mt-6">
              <div className="h-5 w-full bg-primary/20 rounded-sm"></div>
              <div className={`h-5 w-full ${currentMetric.mms >= avgMms * 0.8 ? 'bg-primary/50' : 'bg-surface-container'} rounded-sm`}></div>
              <div className={`h-5 w-full ${currentMetric.mms >= avgMms * 1.2 ? 'bg-primary' : 'bg-surface-container'} rounded-sm`}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Bento Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container p-5 rounded-sm border border-outline-variant/10">
          <div className="mb-4">
            <p className="text-on-surface-variant text-[9px] font-bold uppercase tracking-widest inline-flex items-center">Mental Penetration<MetricInfo text="% of all respondents who linked this brand to at least one CEP. Higher = more people have this brand in mind." /></p>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black italic tracking-tighter">{currentMetric.mPen.toFixed(1)}%</span>
            <span className={`text-[10px] font-bold mt-1 ${currentMetric.mPen > avgPen ? 'text-primary' : 'text-error'}`}>
               {currentMetric.mPen > avgPen ? '+' : ''}{(currentMetric.mPen - avgPen).toFixed(1)}% vs avg
            </span>
          </div>
        </div>

        <div className="bg-surface-container p-5 rounded-sm border border-outline-variant/10">
          <div className="mb-4">
            <p className="text-on-surface-variant text-[9px] font-bold uppercase tracking-widest inline-flex items-center">Network Size<MetricInfo text="Average number of CEPs linked to this brand by those who mentioned it. Higher = richer, broader mental associations." /></p>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black italic tracking-tighter">{currentMetric.networkSize.toFixed(2)}</span>
            <span className={`text-[10px] font-bold mt-1 ${currentMetric.networkSize > avgNs ? 'text-primary' : 'text-error'}`}>
               {currentMetric.networkSize > avgNs ? '+' : ''}{(currentMetric.networkSize - avgNs).toFixed(2)} vs avg
            </span>
          </div>
        </div>

        <div className="bg-surface-container p-5 rounded-sm border border-outline-variant/10">
          <div className="mb-4">
            <p className="text-on-surface-variant text-[9px] font-bold uppercase tracking-widest inline-flex items-center">Mental Market Share<MetricInfo text="This brand's share of all associations in the category. A proxy for dominance of mental space relative to all competitors." /></p>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black italic tracking-tighter">{currentMetric.mms.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="bg-surface-container p-5 rounded-sm border border-outline-variant/10">
          <div className="mb-4">
            <p className="text-on-surface-variant text-[9px] font-bold uppercase tracking-widest inline-flex items-center">Associations<MetricInfo text="Total number of times this brand was mentioned across all respondents and all CEPs in this dataset." /></p>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black italic tracking-tighter">{bData.totalAssociations}</span>
            <span className="text-primary text-[10px] font-bold mt-1">Total Mentions</span>
          </div>
        </div>
      </section>

      {/* Analysis Row */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
        
        <div className="xl:col-span-8 bg-surface-container-low p-6 rounded-sm border border-outline-variant/10">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant italic mb-4">Mental Penetration — All Brands</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#c7c4d7' }} />
              <YAxis tick={{ fontSize: 10, fill: '#c7c4d7' }} unit="%" />
              <Tooltip
                contentStyle={{ background: '#171f33', border: '1px solid #464554', borderRadius: 4 }}
                labelStyle={{ color: '#dae2fd', fontWeight: 700, fontSize: 12 }}
                itemStyle={{ color: '#f36b1f' }}
                formatter={(v) => [`${v}%`, 'MPen']}
              />
              <Bar dataKey="mPen" radius={[2, 2, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.name === selectedBrand ? '#f36b1f' : '#222a3d'} stroke={entry.name === selectedBrand ? '#f36b1f' : '#464554'} strokeWidth={1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CEP Strength Breakdown */}
        <div className="xl:col-span-4 bg-surface-container-high p-6 rounded-sm border border-outline-variant/10">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary italic mb-8">CEP Association Component</h3>
          <div className="space-y-6">
             {cepStrengths.map((cs, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-on-surface truncate pr-2" title={cs.cep}>{cs.cep}</span>
                    <span className="text-primary">{cs.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{width: `${cs.percentage}%`, opacity: 1 - (i * 0.2)}}></div>
                  </div>
                </div>
             ))}
          </div>
        </div>

      </section>

    </div>
  );
}
