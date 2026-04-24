

import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './component/Login'  // Changed from './components/Login'
import Register from './component/Register'  // Changed from './components/Register'
import Upload from './component/Upload'
import PasswordResetRequest from './component/PasswordResetRequest'  // Changed
import ConfirmPassword from './component/ComformPassword'
import ProtectedRoute from './component/ProtectedRoutes'  // Changed from './components/ProtectedRoute'
import { QuestionForm } from './component/QuestionForm'
import DataMorphAI from './component/DataMorphAI'
import { UploadForm } from './component/UploadForm'
import { SuggestionsView } from './component/SuggestionsView'
import { ManualSelectionView } from './component/ManualSelectionView'
import { ResultView } from './component/ResultView'
import './App.css'


function App() {
  const location = useLocation()

  // Check if current page should show navbar
  const showNavbar = location.pathname === "/upload"

  return (
    <div className="app-container">
      {/* Simple navbar for upload page only */}
      {/* {showNavbar && (
        <nav className="simple-nav">
          <div className="nav-content">
            <h2>File Upload Dashboard</h2>
            <button 
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = '/login'
              }}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </nav>
      )} */}

      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Advanced AI Components Previews */}
        <Route path="/question" element={<QuestionForm onChange={() => {}} />} />
        <Route path="/upload-form" element={<UploadForm onUpload={() => {}} isAnalyzing={false} />} />
        <Route path="/suggestions" element={
          <SuggestionsView 
            uploadData={{file_info: {filename: 'preview.csv'}, ai_analysis: {suggestions: []}}} 
            selectedOperations={[]} 
            toggleSelection={() => {}} 
            onApply={() => {}} 
            isApplying={false} 
          />
        } />
        <Route path="/manual-selection" element={
          <ManualSelectionView 
            uploadData={{file_info: {filename: 'preview.csv', rows: 100}, profile: []}} 
            onApplyManual={() => {}} 
            isApplying={false} 
            hasAISuggestions={false} 
            onSwitchMode={() => {}} 
          />
        } />
        <Route path="/result-view" element={
          <ResultView 
            result={{logs: ['Preview Log 1', 'Preview Log 2']}} 
            onReset={() => {}} 
          />
        } />

        <Route path="/password-reset" element={<PasswordResetRequest />} />
        <Route path="/reset-password/:uid/:token" element={<ConfirmPassword />} />


        {/* Protected routes - Only accessible after login */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/datamorph"
          element={
            <ProtectedRoute>
              <DataMorphAI />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App