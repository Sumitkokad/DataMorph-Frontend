import React from 'react';
const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/g, '');
export const ResultView = ({ result, onReset }) => {
  return (
    <div className="glass-panel">
      <h2>✅ Execution Successful</h2>
      
      {result.download && result.download.download_url && (
        <div style={{ margin: '2rem 0' }}>
          <a href={`${API}${result.download.download_url}`} download>
            <button className="btn btn-success" style={{ width: 'auto' }}>
              <span style={{ marginRight: '0.5rem' }}>⬇️</span> Download Processed File
            </button>
          </a>
        </div>
      )}

      {result.download && !result.download.download_url && (
        <div style={{ margin: '2rem 0', color: 'var(--success-color)' }}>
          📁 Processed CSV has been downloaded automatically.
        </div>
      )}
      
      <h3>Execution Logs</h3>
      <div className="logs-container">
        {result.logs?.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          className="btn" 
          style={{ width: 'auto', background: 'transparent', border: '1px solid var(--border-color)' }} 
          onClick={onReset}
        >
          Start Over
        </button>
      </div>
    </div>
  );
};
