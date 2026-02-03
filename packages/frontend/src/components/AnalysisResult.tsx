import React from 'react';
import { motion } from 'framer-motion';

interface AnalysisResultProps {
    isLoading: boolean;
    result: any;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ isLoading, result }) => {
    if (isLoading) {
        return (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    style={{
                        width: '60px',
                        height: '60px',
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTop: '3px solid var(--primary-cyan)',
                        borderRadius: '50%',
                        marginBottom: '2rem'
                    }}
                />
                <h3 className="title-display" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Processing Artifacts</h3>
                <p style={{ color: 'var(--text-dim)' }}>Running AI inference and forensic extraction...</p>
            </div>
        );
    }

    if (!result) return null;

    const isFake = result.is_fake;
    const accentColor = isFake ? 'var(--danger-red)' : 'var(--success-green)';
    const glowColor = isFake ? 'var(--danger-glow)' : 'var(--success-glow)';

    // Fallback if distribution is missing
    const distribution = result.distribution || { real: isFake ? 0.1 : 0.9, fake: isFake ? 0.9 : 0.1 };
    const fakePercent = (distribution.fake * 100);
    const realPercent = (distribution.real * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-panel"
            style={{ padding: '3rem', borderLeft: `4px solid ${accentColor}` }}
        >
            {/* Header / Verdict */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: isFake ? 'rgba(255, 59, 59, 0.15)' : 'rgba(0, 255, 157, 0.15)', color: accentColor, fontWeight: 600, fontSize: '0.85rem' }}>
                            ANALYSIS COMPLETE
                        </div>
                    </div>
                    <h1 className="title-display" style={{ fontSize: '3.5rem', margin: 0, lineHeight: 1.1 }}>
                        {isFake ? 'MANIPULATION DETECTED' : 'CONTENT VERIFIED'}
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '600px', marginTop: '1rem' }}>
                        {isFake
                            ? "Forensic analysis indicates high probability of synthetic manipulation or deepfake generation techniques."
                            : "No significant anomalies detected across visual spectrum or metadata analysis."}
                    </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>CONFIDENCE SCORE</div>
                    <div style={{ fontSize: '4rem', fontWeight: 700, color: accentColor, lineHeight: 1, textShadow: `0 0 30px ${glowColor}` }}>
                        {(result.confidence * 100).toFixed(0)}%
                    </div>
                </div>
            </div>

            {/* Probability Bars */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 500 }}>Real Probability</span>
                        <span style={{ color: 'var(--text-dim)' }}>{realPercent.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${realPercent}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ height: '100%', background: 'var(--text-main)' }}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 500, color: isFake ? 'var(--danger-red)' : '' }}>Fake Probability</span>
                        <span style={{ color: 'var(--text-dim)' }}>{fakePercent.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fakePercent}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ height: '100%', background: 'var(--danger-red)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Detailed Analysis (Video/Image) */}
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--text-dim)', fontSize: '1rem' }}>
                FORENSIC DETAILS
            </h3>

            {result.forensic ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>METADATA INTEGRITY</h4>
                        <div style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            {result.forensic.metadata?.hasProfile ? (
                                <span style={{ color: 'var(--success-green)' }}>✓ Valid Color Profile</span>
                            ) : (
                                <span style={{ color: 'var(--text-dim)' }}>⚠ No Profile Data</span>
                            )}
                        </div>
                        <div style={{ marginTop: '0.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                            {result.forensic.width}x{result.forensic.height} • {result.forensic.format}
                        </div>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>ELA COMPRESSION NOISE</h4>
                        <div style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            {result.forensic.ela?.score < 0.2 ? (
                                <span style={{ color: 'var(--success-green)' }}>✓ Consistent Compression</span>
                            ) : (
                                <span style={{ color: 'var(--danger-red)' }}>⚠ High Error Level Detected</span>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                // Video Frames - Horizontal Scroll
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Analyzed Frames</span>
                        <span style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem' }}>{result.fps?.toFixed(0)} FPS Source</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        overflowX: 'auto',
                        paddingBottom: '1rem',
                        maskImage: 'linear-gradient(to right, black 80%, transparent 100%)'
                    }}>
                        {result.frameAnalysis?.map((frame: any, idx: number) => (
                            <div key={idx} style={{ minWidth: '180px', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Frame {frame.frameIndex}</div>
                                <div style={{ fontWeight: 600, color: frame.forensic?.ela ? 'var(--danger-red)' : 'var(--text-main)' }}>
                                    {frame.forensic?.ela ? 'ELA Artifacts' : 'Clean'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </motion.div>
    );
};

export default AnalysisResult;
