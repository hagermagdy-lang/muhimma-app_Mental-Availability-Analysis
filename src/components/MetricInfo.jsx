export default function MetricInfo({ text }) {
  return (
    <span className="relative group inline-flex items-center ml-1.5 cursor-help">
      <span className="material-symbols-outlined text-secondary leading-none" style={{ fontSize: '10px' }}>info</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-surface-container-highest text-on-surface text-xs rounded-lg p-3 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-2xl border border-outline-variant/20 font-normal normal-case tracking-normal">
        {text}
      </span>
    </span>
  );
}
