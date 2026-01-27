import React from 'react';
import { motion } from 'framer-motion';

interface AnalysisResultProps {
    isLoading: boolean;
    result: any; // Type better later
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ isLoading, result }) => {
    if (isLoading) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3 className="neon-text">ANALYZING ARTIFACTS...</h3>
                <div style={{
                    width: '100%',
                    height: '4px',
                    background: '#1a1a1a',
                    marginTop: '1rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: '50%',
                            background: 'var(--primary-cyan)'
                        }}
                    />
                </div>
            </div>
        );
    }

    if (!result) return null;

    const isFake = result.is_fake;
    const color = isFake ? 'var(--danger-red)' : 'var(--primary-cyan)';
    const glow = isFake ? 'var(--danger-glow)' : 'var(--primary-glow)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ padding: '2rem', border: `1px solid ${color}`, boxShadow: `0 0 30px ${glow} inset` }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h4 style={{ color: 'var(--text-dim)', margin: 0 }}>VERDICT</h4>
                    <h1 style={{ fontSize: '3rem', margin: 0, color: color, textShadow: `0 0 20px ${glow}` }}>
                        {isFake ? 'FAKE DETECTED' : 'AUTHENTIC'}
                    </h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h4 style={{ color: 'var(--text-dim)', margin: 0 }}>CONFIDENCE</h4>
                    <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{(result.confidence * 100).toFixed(1)}%</h2>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>REAL PROBABILITY</span>
                        <span>{(result.distribution.real * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#1a1a1a' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.distribution.real * 100}%` }}
                            style={{ height: '100%', background: 'var(--primary-cyan)', boxShadow: '0 0 10px var(--primary-glow)' }}
                        />
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>FAKE PROBABILITY</span>
                        <span>{(result.distribution.fake * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#1a1a1a' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.distribution.fake * 100}%` }}
                            style={{ height: '100%', background: 'var(--danger-red)', boxShadow: '0 0 10px var(--danger-glow)' }}
                        />
                    </div>
                </div>
            </div>


            {/* Forensic Data Section */}
            {
                (result.forensic || result.frameAnalysis) && (
                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--text-dim)', paddingTop: '1rem' }}>
                        <h3 style={{ color: 'var(--primary-cyan)', marginBottom: '1rem' }}>FORENSIC ANALYSIS</h3>

                        {result.forensic ? (
                            // IMAGE MODE
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ color: 'var(--text-dim)' }}>METADATA</h4>
                                    <div className="glass-panel" style={{ padding: '1rem' }}>
                                        {result.forensic.metadata ? (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Format:</span>
                                                    <span style={{ color: 'var(--primary-cyan)' }}>{result.forensic.format}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Dimensions:</span>
                                                    <span style={{ color: 'var(--primary-cyan)' }}>{result.forensic.width}x{result.forensic.height}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span>No metadata available</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ color: 'var(--text-dim)' }}>ELA ANALYISIS</h4>
                                    <div className="glass-panel" style={{ padding: '1rem' }}>
                                        {result.forensic.ela ? (
                                            <div style={{ textAlign: 'center' }}>
                                                <span style={{ color: 'var(--primary-cyan)' }}>ELA Generated</span>
                                            </div>
                                        ) : (
                                            <span>Analysis Pending</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // VIDEO MODE
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-dim)' }}>Video Metadata</span>
                                    <span style={{ color: 'var(--primary-cyan)' }}>
                                        {result.resolution?.width}x{result.resolution?.height} @ {result.fps?.toFixed(0)}fps | {result.duration?.toFixed(1)}s
                                    </span>
                                </div>

                                <h4 style={{ color: 'var(--text-dim)', marginTop: '1rem' }}>FRAME ANALYSIS</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {result.frameAnalysis?.map((frame: any, idx: number) => (
                                        <div key={idx} className="glass-panel" style={{ padding: '1rem' }}>
                                            <div style={{ marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Frame #{frame.frameIndex}</div>
                                            {frame.forensic?.ela ? (
                                                <div style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem' }}>ELA Pattern Detected</div>
                                            ) : (
                                                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No ELA Artifacts</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </motion.div >
    );
};

export default AnalysisResult;
