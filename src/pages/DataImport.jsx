import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { parseSurveyData } from '../lib/dataProcessor';

export default function DataImport({ onDataProcessed, processedData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: function(results) {
        try {
          const processed = parseSurveyData(results.data);
          onDataProcessed(processed);
        } catch (err) {
          setError(err.message || 'Error processing data. Check file format.');
        } finally {
          setLoading(false);
        }
      },
      error: function(err) {
        setError(err.message);
        setLoading(false);
      }
    });

  }, [onDataProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
      'application/csv': ['.csv'],
      'text/x-csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="flex-grow flex flex-col items-center justify-center pt-8 pb-16 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Visual Decor / Precision Lens Aesthetic */}
      <div className="fixed top-1/4 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Title & Context */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-secondary font-mono text-[10px] tracking-[0.2em] uppercase mb-2 block">System / Intake</span>
            <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface leading-tight">Data Import</h2>
            <p className="text-on-surface-variant mt-4 leading-relaxed text-sm">
              Ingest raw quantitative datasets for precision processing. Our engine automatically normalizes tabular structures for advanced CEP modeling.
            </p>
          </div>

          <div className="bg-surface-container-low p-5 rounded-lg border-l-2 border-primary shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary text-sm">info</span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Calculation Engine</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Data is parsed as 'Wide Text'. Columns represent distinct CEPs, while verbatim cell inputs map to brand associations dynamically.
            </p>
            <a href="/sample_survey.csv" download className="mt-4 inline-block text-[10px] font-bold uppercase tracking-[0.1em] text-secondary hover:opacity-80 transition-opacity">
               Download Sample Format →
            </a>
          </div>
        </div>

        {/* Right Side: Dropzone & Progress */}
        <div className="lg:col-span-7 space-y-4 w-full">
          
          {/* Dropzone */}
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div {...getRootProps()} className="relative group outline-none">
            <input {...getInputProps()} />
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            
            <div className={`relative bg-surface-container-high border-2 border-dashed ${isDragActive ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-secondary/50'} transition-all cursor-pointer rounded-xl p-12 flex flex-col items-center justify-center text-center`}>
              <div className="bg-surface-container-highest p-4 rounded-full mb-6 relative">
                 {loading ? (
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
                 ) : (
                    <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>upload_file</span>
                 )}
              </div>
              
              <h3 className="text-lg font-semibold text-on-surface">
                {loading ? 'Processing Dataset...' : isDragActive ? 'Drop your CSV here' : 'Drag and drop or browse files'}
              </h3>
              
              <p className="text-on-surface-variant text-sm mt-2">Maximum file size: 256MB</p>
              
              <div className="mt-8 flex gap-3">
                <div className="px-3 py-1 bg-surface-container-lowest rounded text-[10px] font-mono text-secondary border border-secondary/20">.CSV</div>
              </div>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center justify-end pt-2">
            <div className="flex gap-4">
               {processedData ? (
                 <button className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white text-[10px] font-bold uppercase tracking-[0.1em] rounded shadow-lg active:scale-95 duration-150">
                     Data Loaded
                 </button>
               ) : (
                 <button className="px-6 py-2.5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.1em] rounded cursor-not-allowed">
                     Pending Input
                 </button>
               )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
