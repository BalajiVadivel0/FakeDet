import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'video/*': ['.mp4', '.mov', '.avi']
        },
        multiple: false
    });

    return (
        <div {...getRootProps()} style={{ width: '100%', height: '100%', minHeight: '350px' }}>
            <input {...getInputProps()} />
            <motion.div
                className="glass-panel"
                animate={{
                    borderColor: isDragActive ? 'rgba(0, 242, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isDragActive ? '0 0 40px rgba(0, 242, 255, 0.15)' : '0 8px 32px 0 rgba(0, 0, 0, 0.36)'
                }}
                whileHover={{ scale: 1.01, borderColor: 'rgba(255, 255, 255, 0.2)' }}
                transition={{ duration: 0.3 }}
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    borderStyle: isDragActive ? 'solid' : 'dashed',
                    borderWidth: '2px'
                }}
            >
                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <motion.div
                        animate={{ y: isDragActive ? -10 : 0 }}
                        style={{
                            fontSize: '4rem',
                            marginBottom: '1.5rem',
                            background: isDragActive
                                ? 'linear-gradient(135deg, #00f2ff 0%, #6366f1 100%)'
                                : 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: isDragActive ? 'drop-shadow(0 0 10px rgba(0,242,255,0.3))' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isDragActive ? '⤓' : '+'}
                    </motion.div>

                    <h3 style={{
                        margin: '0 0 0.5rem 0',
                        color: 'var(--text-main)',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.05em'
                    }}>
                        {isDragActive ? 'DROP TO ANALYZE' : 'UPLOAD EVIDENCE'}
                    </h3>

                    <p style={{ color: 'var(--text-dim)', maxWidth: '300px', margin: '0 auto', fontSize: '0.95rem' }}>
                        Supported formats: JPG, PNG, MP4, AVI
                    </p>
                </div>

                {/* Animated Background Mesh */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    opacity: isDragActive ? 0.1 : 0.03,
                    backgroundImage: 'radial-gradient(circle at center, var(--primary-cyan) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none'
                }}></div>

                {/* Glow Orb */}
                <motion.div
                    animate={{
                        opacity: isDragActive ? 0.2 : 0,
                        scale: isDragActive ? 1.5 : 0.8
                    }}
                    style={{
                        position: 'absolute',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, var(--primary-cyan) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        pointerEvents: 'none'
                    }}
                />
            </motion.div>
        </div>
    );
};

export default UploadZone;
