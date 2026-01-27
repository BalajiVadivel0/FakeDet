import React from 'react';

const NavBar = () => {
    return (
        <nav className="glass-panel" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            margin: '1rem',
            position: 'relative',
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '30px',
                    height: '30px',
                    background: 'var(--primary-cyan)',
                    boxShadow: '0 0 15px var(--primary-glow)',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}></div>
                <h2 className="neon-text" style={{ margin: 0, fontSize: '1.5rem' }}>DEEPFAKE<span style={{ color: '#fff' }}>DETECTOR</span></h2>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <span style={{ color: 'var(--primary-cyan)', cursor: 'pointer' }}>CONSOLE</span>
                <span style={{ color: 'var(--text-dim)', cursor: 'pointer' }}>HISTORY</span>
                <span style={{ color: 'var(--text-dim)', cursor: 'pointer' }}>SETTINGS</span>
            </div>

            <div style={{
                color: 'var(--primary-cyan)',
                border: '1px solid var(--primary-cyan)',
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: '4px'
            }}>
                SYSTEM ONLINE
            </div>
        </nav>
    );
};

export default NavBar;
