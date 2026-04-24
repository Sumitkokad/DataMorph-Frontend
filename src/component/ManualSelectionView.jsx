import React, { useState } from 'react';

export const ManualSelectionView = ({
  uploadData,
  onApplyManual,
  isApplying,
  onSwitchMode,
  hasAISuggestions
}) => {
  const profiles = uploadData.profile || [];
  
  // Maps column name -> array of operation strings
  const [columnOps, setColumnOps] = useState({});
  
  // Maps column name -> custom user prompt if they added "custom_ai"
  const [customPrompts, setCustomPrompts] = useState({});

  const handleAddOp = (column, operation) => {
    if (!operation || operation === 'none') return;
    
    setColumnOps(prev => {
      const existing = prev[column] || [];
      if (existing.includes(operation)) return prev; // prevent duplicates
      return {
        ...prev,
        [column]: [...existing, operation]
      };
    });
  };

  const handleRemoveOp = (column, operation) => {
    setColumnOps(prev => {
      const existing = prev[column] || [];
      return {
        ...prev,
        [column]: existing.filter(op => op !== operation)
      };
    });
  };

  const handleCustomPromptChange = (column, text) => {
    setCustomPrompts(prev => ({
      ...prev,
      [column]: text
    }));
  };

  const handleApply = () => {
    // Process mapping to insert the custom strings
    const payload = {};
    
    Object.entries(columnOps).forEach(([col, ops]) => {
      if (!ops || ops.length === 0) return;
      
      const processedOps = ops.map(op => {
        if (op === 'custom_ai') {
          return `custom:${customPrompts[col] || ''}`;
        }
        return op;
      }).filter(op => op !== 'custom:'); // remove empty custom ops
      
      if (processedOps.length > 0) {
        payload[col] = processedOps;
      }
    });

    onApplyManual(payload);
  };

  const getOpOptions = (profile) => {
    const isNumeric = profile.type.includes('int') || profile.type.includes('float');
    return (
      <>
        <option value="none">Add Operation...</option>
        <option value="drop:column">Drop Column</option>
        <option value="flag:missing">Flag Missing</option>
        <option value="custom_ai">🌟 Custom AI Prompt</option>
        
        {isNumeric && (
          <optgroup label="Numeric Operations">
            <option value="impute:mean">Impute Mean</option>
            <option value="impute:median">Impute Median</option>
            <option value="scale:standard">Standard Scaler</option>
            <option value="scale:minmax">MinMax Scaler</option>
            <option value="detect:outliers_iqr">Detect Outliers</option>
            <option value="handle:outliers">Handle Outliers (Cap)</option>
          </optgroup>
        )}
        {!isNumeric && (
          <optgroup label="Categorical Operations">
            <option value="impute:mode">Impute Mode / Unknown</option>
            <option value="encode:label">Label Encode</option>
            <option value="encode:onehot">One-Hot Encode</option>
            <option value="clean:text">Clean Text</option>
          </optgroup>
        )}
      </>
    );
  };

  const totalOps = Object.values(columnOps).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Manual Column Processing</h2>
        {hasAISuggestions && (
          <button className="btn" style={{ background: 'var(--bg-card)', color: '#fff' }} onClick={onSwitchMode}>
            Switch to AI Suggestions
          </button>
        )}
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Dataset Schema for <strong>{uploadData.file_info.filename}</strong> ({uploadData.file_info.rows} rows)
      </p>

      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '0.75rem', width: '20%' }}>Column</th>
              <th style={{ padding: '0.75rem', width: '10%' }}>Type</th>
              <th style={{ padding: '0.75rem', width: '10%' }}>Missing</th>
              <th style={{ padding: '0.75rem', width: '60%' }}>Operations Pipeline</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(p => {
              const selectedOps = columnOps[p.name] || [];
              const hasCustom = selectedOps.includes('custom_ai');
              
              return (
                <tr key={p.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unique: {p.unique}</div>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)', verticalAlign: 'top' }}>{p.type}</td>
                  <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                    <span style={{ color: p.missing > 0 ? '#F87171' : 'inherit' }}>
                      {p.missing > 0 ? `${p.missing} (Warning)` : '0'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedOps.map(op => (
                          <span key={op} style={{ 
                            background: op === 'custom_ai' ? 'linear-gradient(90deg, #8B5CF6, #EC4899)' : 'rgba(16, 185, 129, 0.2)', 
                            color: op === 'custom_ai' ? '#fff' : '#34D399', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '4px', 
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            {op === 'custom_ai' ? 'Custom AI' : op}
                            <button 
                              onClick={() => handleRemoveOp(p.name, op)}
                              style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem', padding: '0', lineHeight: 1 }}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                      
                      <select 
                        className="form-select" 
                        value="none"
                        onChange={(e) => handleAddOp(p.name, e.target.value)}
                        style={{ padding: '0.5rem', width: 'auto', maxWidth: '250px' }}
                      >
                        {getOpOptions(p)}
                      </select>
                      
                      {hasCustom && (
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. 'Extract the year' or 'Multiply by 100'"
                          value={customPrompts[p.name] || ''}
                          onChange={(e) => handleCustomPromptChange(p.name, e.target.value)}
                          style={{ marginTop: '0.5rem', borderColor: '#8B5CF6' }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button onClick={handleApply} className="btn btn-success" disabled={isApplying || totalOps === 0}>
        {isApplying && <div className="spinner"></div>}
        {isApplying ? 'Applying Pipeline...' : `Execute ${totalOps} Manual Operations`}
      </button>
    </div>
  );
};
