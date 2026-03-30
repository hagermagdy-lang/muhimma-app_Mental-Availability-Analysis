import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout({ processedData }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 pt-16 dark">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/85 backdrop-blur-xl shadow-[0px_0px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between px-6 h-16 w-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="analytics">analytics</span>
            <h1 className="text-primary font-bold text-lg tracking-tighter">The Modern Analyst</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-['Inter'] font-semibold tracking-tight text-sm text-primary hidden md:inline-block">Mental Availability Dashboard</span>
            <button className="active:scale-95 duration-150 hover:bg-[#161e31] transition-colors p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary" data-icon="settings">settings</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Centered Desktop Layout Container (Requested by User) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
        <Outlet context={{ processedData }} />
      </div>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 bg-[#0b1326]/85 backdrop-blur-xl shadow-[0px_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="flex justify-around items-center h-20 w-full px-4 pb-safe max-w-7xl mx-auto">
          
          <Link to="/" className={`flex flex-col items-center justify-center py-1 px-3 transition-all active:scale-90 duration-200 ${currentPath === '/' ? 'text-secondary bg-[#161e31] rounded-lg' : 'text-slate-500 hover:text-secondary'}`}>
            <span className="material-symbols-outlined" data-icon="upload_file">upload_file</span>
            <span className="font-['Inter'] text-[10px] font-medium tracking-wide uppercase mt-1">Upload</span>
          </Link>
          
          <Link to="/executive-summary" className={`flex flex-col items-center justify-center py-1 px-3 transition-all active:scale-90 duration-200 ${currentPath === '/executive-summary' ? 'text-secondary bg-[#161e31] rounded-lg' : 'text-slate-500 hover:text-secondary'}`}>
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
            <span className="font-['Inter'] text-[10px] font-medium tracking-wide uppercase mt-1">Dashboard</span>
          </Link>
          
          <Link to="/brand-analysis" className={`flex flex-col items-center justify-center py-1 px-3 transition-all active:scale-90 duration-200 ${currentPath === '/brand-analysis' ? 'text-secondary bg-[#161e31] rounded-lg' : 'text-slate-500 hover:text-secondary'}`}>
            <span className="material-symbols-outlined" data-icon="query_stats" style={{fontVariationSettings: currentPath==='/brand-analysis' ? "'FILL' 1" : undefined}}>query_stats</span>
            <span className="font-['Inter'] text-[10px] font-medium tracking-wide uppercase mt-1">Analysis</span>
          </Link>
          
          <Link to="/cep-grid" className={`flex flex-col items-center justify-center py-1 px-3 transition-all active:scale-90 duration-200 ${currentPath === '/cep-grid' ? 'text-secondary bg-[#161e31] rounded-lg' : 'text-slate-500 hover:text-secondary'}`}>
            <span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
            <span className="font-['Inter'] text-[10px] font-medium tracking-wide uppercase mt-1">CEP Grid</span>
          </Link>

        </div>
      </nav>
    </div>
  );
}
