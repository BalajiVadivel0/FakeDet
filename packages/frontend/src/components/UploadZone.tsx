import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
    const [dragActive, setDragActive] = useState(false);

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
        }
    });

    return (
        <div {...getRootProps()} style={{ width: '100%', height: '100%' }}>
            <input {...getInputProps()} />
            <motion.div
                className="glass-panel"
                animate={{
                    borderColor: isDragActive ? 'var(--primary-cyan)' : 'transparent',
                    boxShadow: isDragActive ? '0 0 30px var(--primary-glow)' : 'none'
                }}
                style={{
                    border: '2px dashed var(--text-dim)',
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ fontSize: '3rem', color: 'var(--primary-cyan)', marginBottom: '1rem' }}>
                    ⤓
                </div>
                <h3 style={{ margin: 0 }}>INITIATE DATA UPLOAD</h3>
                <p style={{ color: 'var(--text-dim)' }}>DRAG EVIDENCE FILE HERE OR CLICK TO BROWSE</p>

                {/* Decorative Grid */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    pointerEvents: 'none'
                }}></div>
            </motion.div>
        </div>
    );
};

export default UploadZone;
