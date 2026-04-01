import { useState, useCallback } from 'react';
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 mt-4 md:mt-10">

      {/* Page Header */}
      <div>
        <p className="text-secondary font-label text-xs uppercase tracking-[0.2em] mb-2">Step 1 of 2</p>
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Data Upload</h2>
        <p className="mt-3 text-on-surface-variant max-w-2xl leading-relaxed text-sm">
          Upload your survey CSV file. Brands and Category Entry Points (CEPs) are detected automatically from the column headers and cell values.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Dropzone — takes 2/3 width */}
        <div className="lg:col-span-2">
          <div {...getRootProps()} className="outline-none cursor-pointer h-full min-h-[280px]">
            <input {...getInputProps()} />
            <div className={`h-full min-h-[280px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-12 transition-all
              ${isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-outline-variant hover:border-secondary/60 bg-surface-container-high'
              }`}>
              <div className="bg-surface-container-highest p-5 rounded-full mb-6">
                {loading ? (
                  <span className="material-symbols-outlined text-5xl text-primary animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>upload_file</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">
                {loading ? 'Processing...' : isDragActive ? 'Drop your CSV here' : 'Drag & drop or click to browse'}
              </h3>
              <p className="text-on-surface-variant text-sm">.CSV format · Max 256MB</p>
              {processedData && !loading && (
                <div className="mt-6 flex items-center gap-2 text-primary text-sm font-bold">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  File loaded — drop a new one to replace
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info panel — takes 1/3 width */}
        <div className="flex flex-col gap-4">
          <div className="bg-surface-container-low p-6 rounded-xl border-l-2 border-primary flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-sm">info</span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Expected Format</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Each <strong className="text-on-surface">column header</strong> is a Category Entry Point (CEP). Each <strong className="text-on-surface">cell</strong> contains the brand name(s) the respondent associated with that CEP, separated by commas.
            </p>
            <a href="/sample_survey.csv" download className="mt-5 inline-block text-xs font-bold uppercase tracking-widest text-secondary hover:opacity-80 transition-opacity">
              Download Sample CSV →
            </a>
          </div>

          <div className="bg-surface-container p-5 rounded-xl">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Status</p>
            {processedData ? (
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="text-sm font-bold text-primary">Data Loaded</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                <span className="text-sm text-on-surface-variant">Awaiting file</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
