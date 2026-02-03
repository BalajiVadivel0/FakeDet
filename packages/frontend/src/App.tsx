import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from './components/NavBar';
import UploadZone from './components/UploadZone';
import AnalysisResult from './components/AnalysisResult';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Mock History for now
  const [history, setHistory] = useState<any[]>([]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setResult(data);
      setAnalyzing(false);
      fetchHistory();

    } catch (error) {
      console.error("Upload failed", error);
      setAnalyzing(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) { console.error("History fetch error"); }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />

      <main style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>

        {/* Hero Section - Animate out when result comes */}
        <AnimatePresence>
          {!result && !analyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              style={{ textAlign: 'center', margin: '4rem 0 3rem 0', width: '100%', maxWidth: '800px' }}
            >
              <h1 className="title-display" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                DEEPFAKE <span style={{ color: 'var(--primary-cyan)' }}>DETECTOR</span>
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                Advanced forensic verification using hybrid AI visualization.
                Detect digital manipulation in real-time.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Interaction Area */}
        <div style={{ width: '100%', maxWidth: result ? '1000px' : '800px', transition: 'max-width 0.5s ease' }}>

          {/* Upload Zone - Collapses when result is shown, or stays if we want re-upload */}
          {!result && (
            <motion.div layout>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <UploadZone onFileSelect={handleFileSelect} />
              </div>
            </motion.div>
          )}

          {/* Analysis View */}
          <div style={{ marginTop: '2rem' }}>
            <AnalysisResult isLoading={analyzing} result={result} />
          </div>

          {/* Re-upload Action */}
          {result && !analyzing && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                className="btn-ghost"
                onClick={() => { setResult(null); setFile(null); }}
              >
                Analyzing another artifact? Reset Scanner
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Background Ambience */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '30vh',
        background: 'linear-gradient(to top, rgba(11, 14, 20, 1) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: -1
      }}></div>

    </div>
  );
}

export default App;
