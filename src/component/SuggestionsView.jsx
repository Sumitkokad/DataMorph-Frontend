import React from 'react';

export const SuggestionsView = ({
  uploadData,
  selectedOperations,
  toggleSelection,
  onApply,
  isApplying,
  onSwitchMode
}) => {
  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>AI Preprocessing Suggestions</h2>
        {onSwitchMode && (
          <button className="btn" style={{ background: 'var(--bg-card)', color: '#fff' }} onClick={onSwitchMode}>
            Switch to Manual Processing
          </button>
        )}
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Analysis completed on <strong>{uploadData.file_info.filename}</strong>
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
        {uploadData.ai_analysis.suggestions.map((op, idx) => {
          const isDict = typeof op === 'object';
          const operation = isDict ? op.operation : op;
          const column = isDict ? op.column : 'Dataset-Wide';
          const opStr = JSON.stringify(op);
          const isChecked = selectedOperations.some(o => JSON.stringify(o) === opStr);
          
          return (
            <div key={idx} className="op-card">
              <div className="op-header">
                <input 
                  type="checkbox" 
                  className="op-checkbox"
                  checked={isChecked}
                  onChange={() => toggleSelection(opStr, isDict)} 
                />
                <div className="op-label">
                  {isDict ? (
                    <>Apply <strong>{operation}</strong> to <strong>{column}</strong></>
                  ) : (
                     <strong>{operation}</strong>
                  )}
                </div>
                {isDict && <div className="op-type">Column Operation</div>}
                {!isDict && <div className="op-type" style={{background:'rgba(16,185,129,0.2)', color:'#34D399'}}>Global Operation</div>}
              </div>
              
              {isDict && op.reasoning && (
                <div className="op-reasoning">
                  <span style={{ fontSize: '1.2rem' }}>💡</span> 
                  <div>
                    <strong>AI Reasoning:</strong> {op.reasoning}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <button onClick={onApply} className="btn btn-success" disabled={isApplying}>
        {isApplying && <div className="spinner"></div>}
        {isApplying ? 'Applying Pipeline...' : `Execute ${selectedOperations.length} Operations`}
      </button>
    </div>
  );
};
