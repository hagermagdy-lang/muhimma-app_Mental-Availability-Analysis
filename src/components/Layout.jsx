import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout({ processedData }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 pt-20 dark">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/95 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex items-center px-6 h-20 w-full max-w-7xl mx-auto">
          <div className="flex flex-col justify-center gap-0.5">
            <h1 className="text-primary font-black text-2xl tracking-tight leading-none">Muhimmaapp Analytics</h1>
            <span className="text-on-surface-variant text-sm font-medium tracking-wide">Mental Availability Analysis</span>
          </div>
        </div>
      </header>
      
      {/* Centered Desktop Layout Container (Requested by User) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4" style={{paddingTop: '1.5rem'}}>
        <Outlet context={{ processedData }} />
      </div>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 bg-[#0b1326]/85 backdrop-blur-xl shadow-[0px_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="flex justify-around items-center h-20 w-full px-4 pb-safe max-w-7xl mx-auto">
          
          <Link to="/" className={`flex items-center justify-center py-2 px-5 rounded-lg transition-all active:scale-95 duration-200 text-sm font-semibold tracking-wide ${currentPath === '/' ? 'text-secondary bg-[#161e31]' : 'text-slate-400 hover:text-secondary'}`}>
            Data Upload
          </Link>

          <Link to="/executive-summary" className={`flex items-center justify-center py-2 px-5 rounded-lg transition-all active:scale-95 duration-200 text-sm font-semibold tracking-wide ${currentPath === '/executive-summary' ? 'text-secondary bg-[#161e31]' : 'text-slate-400 hover:text-secondary'}`}>
            Overview
          </Link>

          <Link to="/brand-analysis" className={`flex items-center justify-center py-2 px-5 rounded-lg transition-all active:scale-95 duration-200 text-sm font-semibold tracking-wide ${currentPath === '/brand-analysis' ? 'text-secondary bg-[#161e31]' : 'text-slate-400 hover:text-secondary'}`}>
            Brand Analysis
          </Link>

          <Link to="/cep-grid" className={`flex items-center justify-center py-2 px-5 rounded-lg transition-all active:scale-95 duration-200 text-sm font-semibold tracking-wide ${currentPath === '/cep-grid' ? 'text-secondary bg-[#161e31]' : 'text-slate-400 hover:text-secondary'}`}>
            CEP Map
          </Link>

          <Link to="/ai-insights" className={`flex items-center justify-center py-2 px-5 rounded-lg transition-all active:scale-95 duration-200 text-sm font-semibold tracking-wide ${currentPath === '/ai-insights' ? 'text-secondary bg-[#161e31]' : 'text-slate-400 hover:text-secondary'}`}>
            AI Analyst
          </Link>

        </div>
      </nav>
    </div>
  );
}
