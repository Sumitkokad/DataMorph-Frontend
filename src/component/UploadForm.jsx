import React, { useState } from 'react';
import { QuestionForm } from './QuestionForm';

export const UploadForm = ({ onUpload, isAnalyzing }) => {
  const [file, setFile] = useState(null);
  const [context, setContext] = useState('{}');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file, context);
    }
  };

  return (
    <div className="glass-panel">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>1. Upload Dataset (CSV)</label>
          <div className="file-input-wrapper">
            <input 
              type="file" 
              accept=".csv" 
              onChange={e => setFile(e.target.files?.[0] || null)} 
              required 
            />
          </div>
        </div>
        
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label>2. Data Preprocessing Context</label>
          <QuestionForm onChange={(jsonStr) => setContext(jsonStr)} />
        </div>
        
        <button type="submit" className="btn" disabled={!file || isAnalyzing}>
          {isAnalyzing && <div className="spinner"></div>}
          {isAnalyzing ? 'AI is Analyzing...' : 'Analyze Dataset'}
        </button>
      </form>
    </div>
  );
};
