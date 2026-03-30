import React from 'react';
import { CheckCircle, Tag } from 'lucide-react';

export default function DataPreview({ processedData, onConfirm, onCancel }) {
  if (!processedData) return null;

  const { brands, ceps, totalRespondents } = processedData;

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <CheckCircle className="text-secondary" size={28} />
        <div>
          <h2 className="headline-sm">Data Parsed Successfully</h2>
          <p className="body-sm text-on-surface-variant">
            Processed {totalRespondents} respondents. Please verify the auto-detected brands and CEPs before continuing.
          </p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(300px, 1fr)', gap: '2.5rem', marginTop: '1rem' }}>
        
        <div>
          <h3 className="title-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Tag size={18} className="text-primary"/> 
            Detected Brands ({brands.length})
          </h3>
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {brands.map(b => (
              <li key={b} className="body-sm" style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--surface-container-low)', borderRadius: '4px', borderLeft: '2px solid var(--primary)' }}>
                {b}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="title-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Tag size={18} className="text-secondary"/> 
            Cleaned CEPs ({ceps.length})
          </h3>
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ceps.filter(Boolean).map(c => (
              <li key={c} className="body-sm" style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--surface-container-low)', borderRadius: '4px', borderLeft: '2px solid var(--secondary)' }}>
                {c}
              </li>
            ))}
          </ul>
        </div>
        
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--ghost-border)' }}>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onConfirm}>
          Proceed to Analytics
        </button>
      </div>

    </div>
  );
}
