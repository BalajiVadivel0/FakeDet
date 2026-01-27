import React, { useState } from 'react';
import NavBar from './components/NavBar';
import UploadZone from './components/UploadZone';
import AnalysisResult from './components/AnalysisResult';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setAnalyzing(true);
    setResult(null);

    // Simulate API call for now (until actual backend connection)
    // In next step: replace with actual fetch to localhost:3001/api/analyze

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

    } catch (error) {
      console.error("Upload failed", error);
      setAnalyzing(false);
    }
  };



  // Fetch history on load
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Failed to fetch history");
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  // Update fetchHistory after analysis
  React.useEffect(() => {
    if (!analyzing && result) {
      fetchHistory();
    }
  }, [analyzing, result]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="scanline"></div>
      <NavBar />

      <main style={{ flex: 1, padding: '2rem', display: 'flex', gap: '2rem', maxWidth: '1600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Left Panel: Input */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h1 className="neon-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>EVIDENCE ANALYSIS</h1>
            <p style={{ color: 'var(--text-dim)' }}>Upload media artifacts for forensic deepfake verification.</p>
          </div>

          <div style={{ flex: 1, minHeight: '400px' }}>
            <UploadZone onFileSelect={handleFileSelect} />
          </div>
        </div>

        {/* Right Panel: Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* If file selected, show preview */}
          {file && (
            <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '60px', height: '60px', background: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>{file.name}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          )}

          <AnalysisResult isLoading={analyzing} result={result} />

          {/* History Panel */}
          <div className="glass-panel" style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--text-dim)', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-dim)' }}>RECENT SCANS</h3>
              <button onClick={fetchHistory} className="btn-cyber" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>REFRESH</button>
            </div>

            {history.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>NO RECENT DATA</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.map((session) => (
                  <div key={session.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${session.result?.verdict === 'Fake' ? 'var(--danger-red)' : 'var(--primary-cyan)'}`
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{session.filename}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date(session.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        color: session.result?.verdict === 'Fake' ? 'var(--danger-red)' : 'var(--primary-cyan)',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {session.result?.verdict}
                      </div>
                      <div style={{ fontSize: '0.8rem' }}>{(session.result?.overallConfidence * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;