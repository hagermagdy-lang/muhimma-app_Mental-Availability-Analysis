import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import DataImport from './pages/DataImport';
import DataPreview from './components/DataPreview'; // reuse old one? Wait, moved to pages? Wait, old one is fine.
import ExecutiveSummary from './pages/ExecutiveSummary';
import BrandAnalysis from './pages/BrandAnalysis'; // we haven't created this yet
import CEPGrid from './pages/CEPGrid'; // we haven't created this yet

// Placeholder until built
const Placeholder = ({ title }) => <div className="p-8 text-center mt-20 text-on-surface-variant">Building {title}...</div>;

function AppContent() {
  const [processedData, setProcessedData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('muhimma_data');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const navigate = useNavigate();

  const handleDataProcessed = (data) => {
    setProcessedData(data);
    try { sessionStorage.setItem('muhimma_data', JSON.stringify(data)); } catch {}
    navigate('/preview');
  };

  const handlePreviewConfirm = () => {
    navigate('/executive-summary');
  };

  const handleReset = () => {
    setProcessedData(null);
    sessionStorage.removeItem('muhimma_data');
    navigate('/');
  };

  return (
    <Routes>
      <Route element={<Layout processedData={processedData} />}>
        {/* Pages */}
        <Route path="/" element={<DataImport onDataProcessed={handleDataProcessed} processedData={processedData} />} />
        
        <Route 
          path="/preview" 
          element={
            <div className="mt-8 animate-in slide-in-from-bottom flex justify-center w-full">
              <DataPreview 
                processedData={processedData} 
                onConfirm={handlePreviewConfirm} 
                onCancel={handleReset} 
              />
            </div>
          } 
        />
        
        <Route path="/executive-summary" element={<ExecutiveSummary />} />
        <Route path="/brand-analysis" element={<BrandAnalysis />} />
        <Route path="/cep-grid" element={<CEPGrid />} />
        
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
