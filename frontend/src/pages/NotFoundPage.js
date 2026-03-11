import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function NotFoundPage() {
    const navigate = useNavigate();
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(d => d.length >= 3 ? '' : d + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-main, #F7F6F3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
            padding: '24px',
            textAlign: 'center',
        }}>
            {/* Número 404 grande */}
            <div style={{
                fontSize: 'clamp(80px, 20vw, 160px)',
                fontWeight: '900',
                lineHeight: 1,
                letterSpacing: '-4px',
                background: 'linear-gradient(135deg, #2D6A4F 0%, #8338EC 50%, #E76F51 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px',
                userSelect: 'none',
            }}>
                404
            </div>

            {/* Emoji animado */}
            <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                animation: 'bounce 1.5s infinite',
            }}>
                🧭
            </div>

            <h1 style={{
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: '800',
                color: 'var(--text, #1a1a2e)',
                margin: '0 0 8px 0',
            }}>
                Página no encontrada
            </h1>

            <p style={{
                fontSize: '15px',
                color: 'var(--text-muted, #888)',
                maxWidth: '360px',
                lineHeight: 1.6,
                marginBottom: '32px',
            }}>
                La página que buscas no existe o fue movida{dots}
            </p>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: '#2D6A4F',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 28px',
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        boxShadow: '0 4px 12px rgba(45,106,79,0.25)',
                    }}
                    onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 16px rgba(45,106,79,0.35)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(45,106,79,0.25)'; }}
                >
                    🏠 Ir al Dashboard
                </button>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'var(--surface, #fff)',
                        color: 'var(--text, #1a1a2e)',
                        border: '1.5px solid var(--border, #e8e6e1)',
                        borderRadius: '12px',
                        padding: '12px 28px',
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'transform 0.15s',
                    }}
                    onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                >
                    ← Volver atrás
                </button>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
            `}</style>
        </div>
    );
}

export default NotFoundPage;