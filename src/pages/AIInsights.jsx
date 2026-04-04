import { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { generateInsights } from '../lib/insightsEngine';
import { generateAIAnalysis } from '../lib/aiService';

function renderMarkdown(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <h4 key={i} className="text-base font-bold text-on-surface mt-6 mb-2">{renderInline(line.slice(4))}</h4>;
    if (line.startsWith('## ')) return <h3 key={i} className="text-xl font-bold text-primary mt-8 mb-3 pb-2 border-b border-outline-variant/10">{renderInline(line.slice(3))}</h3>;
    if (line.startsWith('# ')) return <h2 key={i} className="text-2xl font-black text-on-surface mt-8 mb-3 pb-2 border-b border-outline-variant/20">{renderInline(line.slice(2))}</h2>;
    if (/^[-*] /.test(line)) return <li key={i} className="ml-5 mb-2 list-disc text-on-surface-variant leading-relaxed">{renderInline(line.slice(2))}</li>;
    if (/^\d+[\.\)] /.test(line)) return <li key={i} className="ml-5 mb-2 list-decimal text-on-surface-variant leading-relaxed">{renderInline(line.replace(/^\d+[\.\)]\s/, ''))}</li>;
    if (!line.trim()) return <div key={i} className="h-3" />;
    return <p key={i} className="text-on-surface-variant leading-relaxed mb-2">{renderInline(line)}</p>;
  });
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-on-surface font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function AIInsights() {
  const { processedData } = useOutletContext();
  const [mode, setMode] = useState('builtin'); // 'builtin' | 'gemini'
  const [activeSection, setActiveSection] = useState(0);

  // Gemini state
  const [geminiText, setGeminiText] = useState('');
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState(null);
  const [streaming, setStreaming] = useState(false);

  const sections = useMemo(() => {
    if (!processedData) return null;
    return generateInsights(processedData);
  }, [processedData]);

  const handleGeminiGenerate = async () => {
    if (!processedData) return;
    setGeminiLoading(true);
    setStreaming(true);
    setGeminiError(null);
    setGeminiText('');
    try {
      await generateAIAnalysis(processedData, (partial) => {
        setGeminiText(partial);
      });
    } catch (err) {
      const msg = err.message || 'Failed to generate';
      if (msg.includes('API_KEY') || msg.includes('401') || msg.includes('403')) {
        setGeminiError('Invalid API key. Please check your Gemini API key and try again.');
      } else {
        setGeminiError(msg);
      }
    } finally {
      setGeminiLoading(false);
      setStreaming(false);
    }
  };

  if (!sections) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container rounded-lg border border-outline-variant/10 mt-8">
        <h2 className="text-xl font-bold mb-2">No Data Available</h2>
        <p className="text-sm text-on-surface-variant mb-6">Upload a dataset first to enable analysis.</p>
        <Link to="/" className="text-primary hover:underline">Go to Import</Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20 mt-4 md:mt-10">

      {/* Header */}
      <div className="mb-8">
        <p className="text-secondary font-label text-xs uppercase tracking-[0.2em] mb-2">Intelligence Engine</p>
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Strategic Insights</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed mt-3">
          Instant data-driven analysis with optional AI-powered deep dive.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-3 mb-8 bg-surface-container rounded-xl p-1.5 w-fit">
        <button
          onClick={() => setMode('builtin')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            mode === 'builtin' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Instant Analysis
        </button>
        <button
          onClick={() => setMode('gemini')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
            mode === 'gemini' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          AI-Powered Deep Dive
        </button>
      </div>

      {/* ============ BUILT-IN MODE ============ */}
      {mode === 'builtin' && (
        <>
          {/* Section Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {sections.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveSection(i)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  activeSection === i
                    ? 'bg-secondary/20 text-secondary border border-secondary/30'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {s.heading}
              </button>
            ))}
          </div>

          <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">

            {sections[activeSection].items && (
              <div className="p-8 space-y-6">
                {sections[activeSection].items.map((finding, i) => (
                  <div key={i} className="bg-surface-container p-6 rounded-lg border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-sm">{i + 1}</span>
                      <h3 className="text-lg font-bold text-on-surface">{finding.title}</h3>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed text-sm">{finding.text}</p>
                  </div>
                ))}
              </div>
            )}

            {sections[activeSection].rankings && (
              <div>
                <div className="px-8 pt-8 pb-4">
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">All brands ranked by Mental Market Share</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-high/50">
                        <th className="py-3 px-8 text-[10px] font-bold text-outline uppercase tracking-widest">#</th>
                        <th className="py-3 px-4 text-[10px] font-bold text-outline uppercase tracking-widest">Brand</th>
                        <th className="py-3 px-4 text-[10px] font-bold text-outline uppercase tracking-widest">MMS</th>
                        <th className="py-3 px-4 text-[10px] font-bold text-outline uppercase tracking-widest">MPen</th>
                        <th className="py-3 px-4 text-[10px] font-bold text-outline uppercase tracking-widest">NS</th>
                        <th className="py-3 px-4 text-[10px] font-bold text-outline uppercase tracking-widest">Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {sections[activeSection].rankings.map((r) => (
                        <tr key={r.brand} className={`hover:bg-surface-container-highest transition-colors ${r.rank === 1 ? 'bg-primary-container/10 border-l-2 border-primary' : ''}`}>
                          <td className="py-4 px-8 font-black text-on-surface-variant">{r.rank}</td>
                          <td className="py-4 px-4 font-bold text-on-surface">{r.brand}</td>
                          <td className="py-4 px-4 font-mono text-primary font-bold">{r.mms}%</td>
                          <td className="py-4 px-4 font-mono text-on-surface-variant">{r.mPen}%</td>
                          <td className="py-4 px-4 font-mono text-on-surface-variant">{r.ns}</td>
                          <td className="py-4 px-4 text-sm text-on-surface-variant">{r.verdict}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {sections[activeSection].recommendations && (
              <div className="p-8 space-y-6">
                {sections[activeSection].recommendations.map((rec, i) => (
                  <div key={i} className="bg-surface-container p-6 rounded-lg border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-primary text-on-primary text-xs font-black uppercase tracking-widest">{rec.brand}</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed text-sm">{rec.strategy}</p>
                  </div>
                ))}
              </div>
            )}

            {sections[activeSection].stats && (
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Respondents', value: sections[activeSection].stats.respondents },
                    { label: 'Brands', value: sections[activeSection].stats.brands },
                    { label: 'CEPs', value: sections[activeSection].stats.ceps },
                    { label: 'Total Associations', value: sections[activeSection].stats.totalAssociations },
                    { label: 'Avg Mental Penetration', value: sections[activeSection].stats.avgPen + '%' },
                    { label: 'Avg Network Size', value: sections[activeSection].stats.avgNs },
                  ].map((s, i) => (
                    <div key={i} className="bg-surface-container p-5 rounded-lg">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">{s.label}</p>
                      <p className="text-2xl font-black text-on-surface">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ============ GEMINI MODE ============ */}
      {mode === 'gemini' && (
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">

          {/* Header Bar */}
          <div className="px-8 py-4 border-b border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Powered by AI</span>
            </div>
            <button
              onClick={handleGeminiGenerate}
              disabled={geminiLoading}
              className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 duration-200 ${
                geminiLoading ? 'bg-outline text-on-surface' : 'bg-primary text-on-primary hover:bg-secondary'
              }`}
            >
              {geminiLoading ? 'Generating...' : geminiText ? 'Regenerate' : 'Generate AI Analysis'}
            </button>
          </div>

          {/* Content */}
          <div className="p-8 min-h-[400px]">
            {geminiLoading && !geminiText ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-on-surface-variant text-sm font-medium animate-pulse">Running AI analysis...</p>
              </div>
            ) : geminiError ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center gap-4 text-error">
                <span className="material-symbols-outlined text-4xl">error</span>
                <h3 className="text-lg font-bold">Generation Failed</h3>
                <p className="max-w-md text-sm">{geminiError}</p>
              </div>
            ) : geminiText ? (
              <div>
                <div className="flex items-center gap-2 mb-6 text-primary font-bold text-xs uppercase tracking-widest border-b border-primary/20 pb-4">
                  {streaming ? 'Generating...' : 'AI Strategic Analysis'}
                </div>
                <div className="max-w-3xl">
                  {renderMarkdown(geminiText)}
                  {streaming && (
                    <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1 -mb-1 rounded-sm"></span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center gap-6 text-outline">
                <span className="text-6xl opacity-20">AI</span>
                <div>
                  <h3 className="text-lg font-bold opacity-40">AI-Powered Deep Dive</h3>
                  <p className="text-xs opacity-30 mt-2 max-w-sm leading-relaxed">
                    Click Generate to get an AI-powered strategic analysis with brand assessments and recommendations.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
