import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const features = [
    {
        emoji: '💰',
        titulo: 'Control de gastos',
        desc: 'Registra tus gastos diarios por categoría, visualiza gráficas mensuales y exporta tus datos cuando quieras.',
        color: '#2D6A4F',
        bg: '#D8F3DC',
    },
    {
        emoji: '💪',
        titulo: 'Seguimiento deportivo',
        desc: 'Apunta tus entrenamientos, duración y tipo de actividad. Mira tu evolución mes a mes.',
        color: '#8338EC',
        bg: '#EDE3FC',
    },
    {
        emoji: '🎯',
        titulo: 'Metas mensuales',
        desc: 'Define un presupuesto o una meta de sesiones. Recibe alertas cuando te acercas al límite.',
        color: '#E76F51',
        bg: '#FDE8E1',
    },
    {
        emoji: '📊',
        titulo: 'Gráficas y estadísticas',
        desc: 'Visualiza tu actividad con gráficas interactivas por categoría, tipo y evolución temporal.',
        color: '#457B9D',
        bg: '#D4E6EC',
    },
    {
        emoji: '🌍',
        titulo: 'Comunidad',
        desc: 'Compara tu actividad con otros usuarios. Ve quién más está usando el dashboard.',
        color: '#2D6A4F',
        bg: '#D8F3DC',
    },
    {
        emoji: '👤',
        titulo: 'Perfil personalizado',
        desc: 'Foto de perfil, nombre personalizado y tema oscuro. Tu espacio, a tu manera.',
        color: '#8338EC',
        bg: '#EDE3FC',
    },
];

function useInView(ref) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);
    return visible;
}

function FeatureCard({ f, index }) {
    const ref = useRef(null);
    const visible = useInView(ref);
    return (
        <div
            ref={ref}
            style={{
                background: 'white',
                borderRadius: '20px',
                padding: '28px 24px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                border: `2px solid ${f.bg}`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
                cursor: 'default',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${f.bg}`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)';
            }}
        >
            <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: f.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '26px', marginBottom: '16px',
            }}>
                {f.emoji}
            </div>
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e', marginBottom: '8px' }}>
                {f.titulo}
            </div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                {f.desc}
            </div>
        </div>
    );
}
const CAPTURAS = [
    { img: '/screenshot-dashboard.png', titulo: 'Dashboard principal', desc: 'Vista general con estadísticas, gráficas y exportación de datos.' },
    { img: '/screenshot-gastos.png', titulo: 'Control de gastos', desc: 'Registra y categoriza tus gastos. Filtra por mes y exporta a CSV.' },
    { img: '/screenshot-deporte.png', titulo: 'Seguimiento deportivo', desc: 'Apunta tus entrenamientos y visualiza tu progreso mensual.' },
    { img: '/screenshot-perfil.png', titulo: 'Perfil y calendario', desc: 'Calendario de actividad diaria, foto de perfil y tema personalizado.' },
    { img: '/screenshot-comunidad.png', titulo: 'Comunidad y rankings', desc: 'Compara tu actividad con otros usuarios y compite en los rankings mensuales.' },
];

function Carrusel() {
    const [idx, setIdx] = useState(0);
    const prev = () => setIdx(i => (i - 1 + CAPTURAS.length) % CAPTURAS.length);
    const next = () => setIdx(i => (i + 1) % CAPTURAS.length);
    const c = CAPTURAS[idx];

    return (
        <div style={{ position: 'relative', maxWidth: '860px', margin: '0 auto' }}>
            {/* Imagen */}
            <div style={{
                borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(131,56,236,0.15)',
                border: '2px solid #EDE3FC',
                background: '#fff',
            }}>
                <img
                    src={c.img}
                    alt={c.titulo}
                    style={{ width: '100%', display: 'block', maxHeight: '480px', objectFit: 'cover', objectPosition: 'top' }}
                />
                {/* Texto debajo de la imagen */}
                <div style={{ padding: '20px 28px 24px', background: 'white' }}>
                    <div style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a2e', marginBottom: '6px' }}>
                        {c.titulo}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                        {c.desc}
                    </div>
                </div>
            </div>

            {/* Botones anterior / siguiente */}
            <button onClick={prev} style={{
                position: 'absolute', top: '40%', left: '-20px',
                background: 'white', border: '2px solid #EDE3FC',
                borderRadius: '50%', width: '44px', height: '44px',
                fontSize: '18px', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
            }}
                onMouseEnter={e => e.currentTarget.style.background = '#EDE3FC'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >◀</button>
            <button onClick={next} style={{
                position: 'absolute', top: '40%', right: '-20px',
                background: 'white', border: '2px solid #EDE3FC',
                borderRadius: '50%', width: '44px', height: '44px',
                fontSize: '18px', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
            }}
                onMouseEnter={e => e.currentTarget.style.background = '#EDE3FC'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >▶</button>

            {/* Puntos indicadores */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                {CAPTURAS.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setIdx(i)}
                        style={{
                            width: i === idx ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '999px',
                            background: i === idx ? '#8338EC' : '#D0C4E8',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
function LandingPage() {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F7F6F3',
            fontFamily: "'DM Sans', sans-serif",
            overflowX: 'hidden',
        }}>

            {/* Navbar */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '0 32px',
                height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: scrolled ? 'rgba(247,246,243,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.3s ease',
            }}>
                <span style={{ fontWeight: '800', fontSize: '18px', color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                    📋 MyDashboard
                </span>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '8px 22px',
                        background: '#8338EC',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontFamily: 'inherit',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#6a2cc0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#8338EC'}
                >
                    Iniciar sesión
                </button>
            </nav>

            {/* Hero */}
            <section ref={heroRef} style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '100px 24px 60px',
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* Fondo decorativo */}
                <div style={{
                    position: 'absolute', top: '-80px', left: '50%',
                    transform: 'translateX(-50%)',
                    width: '700px', height: '700px',
                    background: 'radial-gradient(circle, rgba(131,56,236,0.10) 0%, rgba(45,106,79,0.06) 50%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '0', right: '-100px',
                    width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(231,111,81,0.10) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }} />

                {/* Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: '#EDE3FC', color: '#8338EC',
                    padding: '6px 16px', borderRadius: '999px',
                    fontSize: '13px', fontWeight: '700',
                    marginBottom: '28px',
                    animation: 'fadeUp 0.6s ease both',
                }}>
                    <span>✨</span> Proyecto TFG · ASIR
                </div>

                {/* Título */}
                <h1 style={{
                    fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
                    fontWeight: '800',
                    color: '#1a1a2e',
                    lineHeight: '1.1',
                    marginBottom: '20px',
                    letterSpacing: '-1.5px',
                    maxWidth: '700px',
                    animation: 'fadeUp 0.6s 0.1s ease both',
                }}>
                    Tu vida diaria,{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #8338EC, #2D6A4F)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        ordenada
                    </span>
                </h1>

                {/* Subtítulo */}
                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                    color: '#555',
                    maxWidth: '520px',
                    lineHeight: '1.7',
                    marginBottom: '40px',
                    animation: 'fadeUp 0.6s 0.2s ease both',
                }}>
                    Dashboard personal para controlar tus gastos, tus entrenamientos y tu progreso mes a mes. Todo en un solo lugar.
                </p>

                {/* CTA */}
                <div style={{
                    display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center',
                    animation: 'fadeUp 0.6s 0.3s ease both',
                }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '14px 36px',
                            background: 'linear-gradient(135deg, #8338EC, #2D6A4F)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '700',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            boxShadow: '0 8px 24px rgba(131,56,236,0.3)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(131,56,236,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(131,56,236,0.3)'; }}
                    >
                        Entrar al dashboard →
                    </button>
                </div>

                {/* Scroll hint */}
                <div style={{
                    position: 'absolute', bottom: '32px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    animation: 'bounce 2s infinite',
                    opacity: 0.5,
                }}>
                    <span style={{ fontSize: '12px', color: '#888', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Ver más</span>
                    <span style={{ fontSize: '18px' }}>↓</span>
                </div>
            </section>
            {/* Capturas de pantalla */}
            <section style={{ padding: '60px 24px 0', maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                        fontWeight: '800', color: '#1a1a2e',
                        letterSpacing: '-1px', marginBottom: '12px',
                    }}>
                        Así se ve por dentro
                    </h2>
                    <p style={{ color: '#777', fontSize: '16px', maxWidth: '440px', margin: '0 auto', lineHeight: '1.6' }}>
                        Una interfaz limpia y pensada para el día a día.
                    </p>
                </div>
                <Carrusel />
            </section>
            {/* Features */}
            <section style={{
                padding: '80px 24px 100px',
                maxWidth: '1100px',
                margin: '0 auto',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                        fontWeight: '800',
                        color: '#1a1a2e',
                        letterSpacing: '-1px',
                        marginBottom: '12px',
                    }}>
                        Todo lo que necesitas
                    </h2>
                    <p style={{ color: '#777', fontSize: '16px', maxWidth: '440px', margin: '0 auto', lineHeight: '1.6' }}>
                        Funcionalidades pensadas para llevar un registro real y sencillo de tu día a día.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                }}>
                    {features.map((f, i) => <FeatureCard key={f.titulo} f={f} index={i} />)}
                </div>
            </section>

            {/* CTA final */}
            <section style={{
                padding: '80px 24px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #EDE3FC 0%, #D8F3DC 100%)',
            }}>
                <h2 style={{
                    fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                    fontWeight: '800',
                    color: '#1a1a2e',
                    letterSpacing: '-0.8px',
                    marginBottom: '12px',
                }}>
                    ¿Listo para empezar?
                </h2>
                <p style={{ color: '#555', fontSize: '15px', marginBottom: '32px' }}>
                    Accede con tu cuenta y empieza a registrar tu actividad hoy.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '14px 40px',
                        background: '#8338EC',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(131,56,236,0.3)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#6a2cc0'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#8338EC'; }}
                >
                    Iniciar sesión →
                </button>
            </section>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
        @media (max-width: 480px) {
          nav { padding: 0 16px; }
        }
      `}</style>
        </div>
    );
}

export default LandingPage;