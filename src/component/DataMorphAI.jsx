import { useState } from 'react';
import '../styles/DataMorphAI.css';
import { UploadForm } from './UploadForm';
import { SuggestionsView } from './SuggestionsView';
import { ResultView } from './ResultView';
import { ManualSelectionView } from './ManualSelectionView';
import API from '../api'; // Use existing API config

function DataMorphAI() {
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadData, setUploadData] = useState(null);

  const [selectedOperations, setSelectedOperations] = useState([]);
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('ai');

  const uploadDataset = async (file, context) => {
    const formData = new FormData();
    formData.append('file', file);
    if (context) {
      formData.append('context', context);
    }
    const response = await API.post('/api/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob'
    });
    return response;
  };

  const applyOperations = async (filePath, operations, columnOperations = {}) => {
    const response = await API.post('/api/apply/', {
      file_path: filePath,
      operations: operations,
      column_operations: columnOperations
    }, {
      responseType: 'blob'
    });
    return response;
  };

  const handleUpload = async (file, context) => {
    setAnalyzing(true);
    try {
      const response = await uploadDataset(file, context);
      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('text/csv')) {
        // Backend returned processed CSV directly (auto mode) - trigger download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'processed.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setResult({
          status: 'success',
          logs: ['✅ Auto-preprocessing complete', '📁 Processed CSV downloaded automatically'],
          download: { filename: 'processed.csv', download_url: null }
        });
        setAnalyzing(false);
        return;
      }

      // Parse JSON response (manual mode / analysis only)
      const reader = new FileReader();
      const data = await new Promise((resolve) => {
        reader.onload = () => resolve(JSON.parse(reader.result));
        reader.readAsText(response.data);
      });

      setUploadData(data);
      if (data.ai_analysis && data.ai_analysis.suggestions) {
        // Pre-select all suggestions
        setSelectedOperations(data.ai_analysis.suggestions);

        // Auto-Execute if user requested fully automatic mode
        try {
          const parsedContext = JSON.parse(context);
          if (parsedContext.automation === 'auto') {
            setApplying(true);
            const resultResponse = await applyOperations(data.file_info.file_path, data.ai_analysis.suggestions);
            const applyContentType = resultResponse.headers['content-type'];

            if (applyContentType && applyContentType.includes('text/csv')) {
              const blob = new Blob([resultResponse.data], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'processed.csv');
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);

              setResult({
                status: 'success',
                logs: ['✅ Operations applied successfully', '📁 Processed CSV downloaded automatically'],
                download: { filename: 'processed.csv', download_url: null }
              });
            } else {
              const resultData = await new Promise((resolve) => {
                const r = new FileReader();
                r.onload = () => resolve(JSON.parse(r.result));
                r.readAsText(resultResponse.data);
              });
              setResult(resultData);
            }
            setApplying(false);
          } else if (parsedContext.automation === 'manual' || data.ai_analysis.status === 'skipped') {
            setMode('manual');
          }
        } catch (e) {
          // ignore parsing error
        }
      } else if (data.ai_analysis && data.ai_analysis.status === 'skipped') {
        setMode('manual');
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleSelection = (opStr, isDict) => {
    setSelectedOperations((prev) => {
      const isSelected = prev.some((o) => JSON.stringify(o) === opStr);
      if (isSelected) {
        return prev.filter((o) => JSON.stringify(o) !== opStr);
      } else {
        return [...prev, isDict ? JSON.parse(opStr) : opStr];
      }
    });
  };

  const handleApply = async () => {
    if (!uploadData?.file_info?.file_path) return;

    setApplying(true);
    try {
      const response = await applyOperations(uploadData.file_info.file_path, selectedOperations, {});
      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('text/csv')) {
        // Backend returned CSV file directly - trigger download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'processed.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setResult({
          status: 'success',
          logs: ['✅ Operations applied successfully', '📁 Processed CSV downloaded automatically'],
          download: { filename: 'processed.csv', download_url: null }
        });
      } else {
        // Fallback JSON response
        const data = await response.data;
        setResult(data);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setApplying(false);
    }
  };

  const handleApplyManual = async (columnOps) => {
    if (!uploadData?.file_info?.file_path) return;

    setApplying(true);
    try {
      const response = await applyOperations(uploadData.file_info.file_path, [], columnOps);
      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('text/csv')) {
        // Backend returned CSV file directly - trigger download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'processed.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setResult({
          status: 'success',
          logs: ['✅ Manual operations applied successfully', '📁 Processed CSV downloaded automatically'],
          download: { filename: 'processed.csv', download_url: null }
        });
      } else {
        const data = await response.data;
        setResult(data);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setApplying(false);
    }
  };

  const handleReset = () => {
    setUploadData(null);
    setResult(null);
    setMode('ai');
  };

  return (
    <div className="datamorph-container">
      <h1 className="datamorph-title">DataMorph AI Advanced</h1>

      {!uploadData && (
        <UploadForm
          onUpload={handleUpload}
          isAnalyzing={analyzing}
        />
      )}

      {uploadData && !result && mode === 'ai' && (
        <SuggestionsView
          uploadData={uploadData}
          selectedOperations={selectedOperations}
          toggleSelection={toggleSelection}
          onApply={handleApply}
          isApplying={applying}
          onSwitchMode={() => setMode('manual')}
        />
      )}

      {uploadData && !result && mode === 'manual' && (
        <ManualSelectionView
          uploadData={uploadData}
          onApplyManual={handleApplyManual}
          isApplying={applying}
          hasAISuggestions={uploadData.ai_analysis?.suggestions?.length > 0}
          onSwitchMode={() => setMode('ai')}
        />
      )}

      {result && (
        <ResultView
          result={result}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default DataMorphAI;
