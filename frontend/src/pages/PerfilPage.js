import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const API_URL = 'https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod';

const COLORES_FONDO = [
    { label: 'Crema (defecto)', value: '#F7F6F3' },
    { label: 'Blanco',          value: '#FFFFFF' },
    { label: 'Menta suave',     value: '#EAF7EE' },
    { label: 'Lavanda suave',   value: '#F0EBFF' },
    { label: 'Melocotón suave', value: '#FEF0EA' },
    { label: 'Azul suave',      value: '#EAF2FB' },
    { label: 'Gris oscuro',     value: '#1E1E2E' },
];

const EMOJI_GASTO = {
    alimentacion: '🍔',
    transporte:   '🚗',
    ocio:         '🎮',
    salud:        '💊',
    deporte:      '👟',
    otros:        '🛍️',
};

const EMOJI_DEPORTE = {
    gimnasio: '🏋️',
    cardio:   '🏃',
    yoga:     '🧘',
    natacion: '🏊',
    ciclismo: '🚴',
    otro:     '⚽',
};

function getEmojiGasto(categoria) {
    return EMOJI_GASTO[(categoria || '').toLowerCase()] || '🛍️';
}
function getEmojiDeporte(tipo) {
    return EMOJI_DEPORTE[(tipo || '').toLowerCase()] || '⚽';
}

function buildDayMap(gastos, entrenamientos) {
    const map = {};
    gastos.forEach(g => {
        const dia = (g.fecha || '').slice(0, 10);
        if (!dia) return;
        if (!map[dia]) map[dia] = [];
        map[dia].push(getEmojiGasto(g.categoria));
    });
    entrenamientos.forEach(e => {
        const dia = (e.fecha || '').slice(0, 10);
        if (!dia) return;
        if (!map[dia]) map[dia] = [];
        map[dia].push(getEmojiDeporte(e.tipo));
    });
    return map;
}

const btnNavStyle = {
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '6px',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
};

function CalendarioActividad({ gastos, entrenamientos }) {
    const [mes, setMes] = useState(new Date());
    const [tooltipDia, setTooltipDia] = useState(null); // key del día activo
    const dayMap = buildDayMap(gastos, entrenamientos);

    // Datos completos por día para el tooltip
    const detailMap = {};
    gastos.forEach(g => {
        const dia = (g.fecha || '').slice(0, 10);
        if (!dia) return;
        if (!detailMap[dia]) detailMap[dia] = { gastos: [], entrenamientos: [] };
        detailMap[dia].gastos.push(g);
    });
    entrenamientos.forEach(e => {
        const dia = (e.fecha || '').slice(0, 10);
        if (!dia) return;
        if (!detailMap[dia]) detailMap[dia] = { gastos: [], entrenamientos: [] };
        detailMap[dia].entrenamientos.push(e);
    });

    const inicio = startOfMonth(mes);
    const fin = endOfMonth(mes);
    const dias = eachDayOfInterval({ start: inicio, end: fin });
    const offsetInicio = (getDay(inicio) + 6) % 7;

    const hoy = format(new Date(), 'yyyy-MM-dd');
    const esMesActual = format(mes, 'yyyy-MM') === format(new Date(), 'yyyy-MM');
    const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    const handleDiaClick = (key, emojis) => {
        if (emojis.length === 0) { setTooltipDia(null); return; }
        setTooltipDia(prev => prev === key ? null : key);
    };

    return (
        <div
            style={{ background: 'white', borderRadius: '16px', padding: '20px 20px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: '32px' }}
            onClick={e => { if (e.target === e.currentTarget) setTooltipDia(null); }}
        >
            {/* Cabecera con selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '15px', color: 'inherit' }}>Registro diario</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => { setMes(subMonths(mes, 1)); setTooltipDia(null); }} style={btnNavStyle}>◀</button>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'inherit', textTransform: 'capitalize', minWidth: '105px', textAlign: 'center' }}>
                        {format(mes, 'MMMM yyyy', { locale: es })}
                    </span>
                    <button
                        onClick={() => { setMes(addMonths(mes, 1)); setTooltipDia(null); }}
                        disabled={esMesActual}
                        style={{ ...btnNavStyle, opacity: esMesActual ? 0.3 : 1, cursor: esMesActual ? 'not-allowed' : 'pointer' }}
                    >▶</button>
                </div>
            </div>

            {/* Cabecera días semana */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
                {DIAS_SEMANA.map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#bbb', padding: '2px 0' }}>{d}</div>
                ))}
            </div>

            {/* Grid de días */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {Array.from({ length: offsetInicio }).map((_, i) => <div key={`e-${i}`} />)}

                {dias.map(dia => {
                    const key = format(dia, 'yyyy-MM-dd');
                    const emojis = dayMap[key] || [];
                    const esHoy = key === hoy;
                    const tooltipAbierto = tooltipDia === key;
                    const visibles = emojis.slice(0, 2);
                    const extra = emojis.length - 2;
                    const detalle = detailMap[key];

                    return (
                        <div
                            key={key}
                            style={{ position: 'relative' }}
                            onMouseEnter={() => emojis.length > 0 && setTooltipDia(key)}
                            onMouseLeave={() => setTooltipDia(null)}
                            onClick={() => handleDiaClick(key, emojis)}
                        >
                            {/* Celda del día */}
                            <div style={{
                                borderRadius: '10px',
                                padding: '5px 2px 4px',
                                minHeight: '52px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '2px',
                                background: tooltipAbierto ? '#EDE3FC' : esHoy ? '#EDE3FC' : emojis.length > 0 ? '#F7F6F3' : 'transparent',
                                border: esHoy ? '2px solid #8338EC' : tooltipAbierto ? '2px solid #8338EC' : '2px solid transparent',
                                cursor: emojis.length > 0 ? 'pointer' : 'default',
                                transition: 'all 0.15s',
                            }}>
                                <span style={{ fontSize: '11px', fontWeight: esHoy ? '800' : '500', color: esHoy ? '#8338EC' : '#666', lineHeight: 1 }}>
                                    {format(dia, 'd')}
                                </span>
                                {visibles.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1px' }}>
                                        {visibles.map((em, i) => (
                                            <span key={i} style={{ fontSize: '13px', lineHeight: 1 }}>{em}</span>
                                        ))}
                                    </div>
                                )}
                                {extra > 0 && (
                                    <span style={{ fontSize: '9px', color: '#8338EC', fontWeight: '700', lineHeight: 1 }}>+{extra}</span>
                                )}
                            </div>

                            {/* Tooltip */}
                            {tooltipAbierto && detalle && (
                                <div style={{
                                    position: 'absolute',
                                    top: '58px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 50,
                                    background: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                                    padding: '10px 12px',
                                    minWidth: '160px',
                                    maxWidth: '220px',
                                    border: '1.5px solid #EDE3FC',
                                    pointerEvents: 'none',
                                }}>
                                    {/* Triángulo */}
                                    <div style={{
                                        position: 'absolute', top: '-7px', left: '50%', transform: 'translateX(-50%)',
                                        width: 0, height: 0,
                                        borderLeft: '7px solid transparent',
                                        borderRight: '7px solid transparent',
                                        borderBottom: '7px solid white',
                                        filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.08))',
                                    }} />

                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#8338EC', marginBottom: '6px', textTransform: 'capitalize' }}>
                                        {format(dia, "d 'de' MMMM", { locale: es })}
                                    </div>

                                    {detalle.gastos.length > 0 && (
                                        <div style={{ marginBottom: detalle.entrenamientos.length > 0 ? '6px' : 0 }}>
                                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>Gastos</div>
                                            {detalle.gastos.map((g, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#333', marginBottom: '2px' }}>
                                                    <span>{getEmojiGasto(g.categoria)} <span style={{ textTransform: 'capitalize' }}>{g.descripcion || g.categoria}</span></span>
                                                    <span style={{ fontWeight: '700', color: '#E76F51', whiteSpace: 'nowrap' }}>{parseFloat(g.cantidad).toFixed(2)} €</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {detalle.entrenamientos.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>Entrenamientos</div>
                                            {detalle.entrenamientos.map((e, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#333', marginBottom: '2px' }}>
                                                    <span>{getEmojiDeporte(e.tipo)} <span style={{ textTransform: 'capitalize' }}>{e.tipo}</span></span>
                                                    <span style={{ fontWeight: '700', color: '#8338EC', whiteSpace: 'nowrap' }}>{e.duracion} min</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Leyenda */}
            <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#dddddd', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Leyenda</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
                    {Object.entries(EMOJI_GASTO).map(([cat, em]) => (
                        <span key={cat} style={{ fontSize: '12px', color: '#dddddd' }}>{em} <span style={{ textTransform: 'capitalize' }}>{cat}</span></span>
                    ))}
                    {Object.entries(EMOJI_DEPORTE).map(([tipo, em]) => (
                        <span key={tipo} style={{ fontSize: '12px', color: '#dddddd' }}>{em} <span style={{ textTransform: 'capitalize' }}>{tipo}</span></span>
                    ))}
                </div>
            </div>
        </div>
    );
}


function PerfilPage({ gastos, entrenamientos, onFondoChange }) {
    const { user, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [fotoUrl, setFotoUrl] = useState('');
    const [mostrarConfig, setMostrarConfig] = useState(false);
    const [nombreEdit, setNombreEdit] = useState('');
    const [fondoEdit, setFondoEdit] = useState(localStorage.getItem('dashboard_fondo') || '#F7F6F3');
    const [guardando, setGuardando] = useState(false);
    const [guardadoOk, setGuardadoOk] = useState(false);
    const [subiendoFoto, setSubiendoFoto] = useState(false);
    const [fotoPreview, setFotoPreview] = useState('');
    const [fotoFile, setFotoFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            user.getSession((err, session) => {
                if (!err) {
                    user.getUserAttributes((err2, attrs) => {
                        if (!err2) {
                            const emailAttr = attrs.find(a => a.Name === 'email');
                            if (emailAttr) setEmail(emailAttr.Value);
                        }
                    });
                }
            });
        }
    }, [user]);

    useEffect(() => {
        if (email) {
            fetch(`${API_URL}/perfil?usuario_id=${encodeURIComponent(email)}`)
                .then(r => r.json())
                .then(data => {
                    if (data.perfil) {
                        setNombre(data.perfil.nombre || '');
                        setFotoUrl(data.perfil.foto_url || '');
                        setNombreEdit(data.perfil.nombre || '');
                    }
                })
                .catch(console.error);
        }
    }, [email]);

    const handleFotoSeleccionada = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFotoFile(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    const guardarPerfil = async () => {
        setGuardando(true);
        try {
            let nuevaFotoUrl = fotoUrl;
            if (fotoFile) {
                setSubiendoFoto(true);
                const extension = fotoFile.name.split('.').pop().toLowerCase();
                const imagen_b64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(fotoFile);
                });
                const res = await fetch(`${API_URL}/foto`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario_id: email, extension, imagen_b64 })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                nuevaFotoUrl = data.foto_url;
                setSubiendoFoto(false);
            }

            await fetch(`${API_URL}/perfil`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: email, nombre: nombreEdit, foto_url: nuevaFotoUrl })
            });

            localStorage.setItem('dashboard_fondo', fondoEdit);
            onFondoChange(fondoEdit);
            setNombre(nombreEdit);
            setFotoUrl(nuevaFotoUrl);
            setFotoFile(null);
            setFotoPreview('');
            setGuardadoOk(true);
            setTimeout(() => { setGuardadoOk(false); setMostrarConfig(false); }, 1500);
        } catch (e) {
            console.error(e);
        } finally {
            setGuardando(false);
            setSubiendoFoto(false);
        }
    };

    const displayName = nombre || email;
    const inicial = displayName ? displayName[0].toUpperCase() : '?';

    const totalGastado = gastos.reduce((sum, g) => sum + parseFloat(g.cantidad || 0), 0);
    const gastoMayor = gastos.length > 0 ? gastos.reduce((max, g) => parseFloat(g.cantidad) > parseFloat(max.cantidad) ? g : max, gastos[0]) : null;
    const categorias = [...new Set(gastos.map(g => g.categoria))].length;
    const totalMinutos = entrenamientos.reduce((sum, e) => sum + (e.duracion || 0), 0);
    const totalHoras = Math.floor(totalMinutos / 60);
    const minutosRestantes = totalMinutos % 60;
    const tipoMasFrecuente = entrenamientos.length > 0
        ? Object.entries(entrenamientos.reduce((acc, e) => { acc[e.tipo] = (acc[e.tipo] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0][0]
        : null;

    const statCard = (emoji, label, value, bgClass) => (
        <div className="perfil-stat-card">
            <div className={`perfil-stat-icon ${bgClass}`}>{emoji}</div>
            <div>
                <div className="perfil-stat-label">{label}</div>
                <div className="perfil-stat-value">{value}</div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="page-header">
                <h1>👤 Perfil</h1>
                <p className="page-subtitle">Tu información personal</p>
            </div>

            <div className="perfil-header-card">
                {fotoUrl ? (
                    <img src={fotoUrl} alt="avatar" className="perfil-avatar-img" />
                ) : (
                    <div className="perfil-avatar-inicial">{inicial}</div>
                )}
                <div style={{ flex: 1 }}>
                    <div className="perfil-nombre">{nombre || email}</div>
                    {nombre && <div className="perfil-email">{email}</div>}
                    <div className="perfil-badge">✓ Cuenta verificada</div>
                </div>
                <button className="perfil-config-btn" onClick={() => setMostrarConfig(true)}>
                    ⚙️ Configurar perfil
                </button>
            </div>

            <div className="perfil-seccion-titulo">💰 Resumen de gastos</div>
            <div className="perfil-stats-grid">
                {statCard('💸', 'Total gastado', `${totalGastado.toFixed(2)} €`, 'peach')}
                {statCard('📋', 'Número de gastos', gastos.length, 'peach')}
                {statCard('🗂️', 'Categorías usadas', categorias, 'peach')}
                {gastoMayor && statCard('⬆️', 'Gasto mayor', `${parseFloat(gastoMayor.cantidad).toFixed(2)} €`, 'peach')}
            </div>

            <div className="perfil-seccion-titulo">💪 Resumen de deporte</div>
            <div className="perfil-stats-grid" style={{ marginBottom: '32px' }}>
                {statCard('⏱️', 'Tiempo total', totalHoras > 0 ? `${totalHoras}h ${minutosRestantes}min` : `${totalMinutos} min`, 'mint')}
                {statCard('🏋️', 'Entrenamientos', entrenamientos.length, 'mint')}
                {tipoMasFrecuente && statCard('🥇', 'Deporte favorito', tipoMasFrecuente, 'mint')}
            </div>

            {/* Calendario de actividad */}
            <div className="perfil-seccion-titulo">📅 Calendario de actividad</div>
            <CalendarioActividad gastos={gastos} entrenamientos={entrenamientos} />

            <button className="perfil-logout-btn" onClick={logout}>
                🚪 Cerrar sesión
            </button>

            {mostrarConfig && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2 className="modal-titulo">⚙️ Configurar perfil</h2>

                        <div className="form-group">
                            <label>Nombre / apodo</label>
                            <input
                                type="text"
                                value={nombreEdit}
                                onChange={e => setNombreEdit(e.target.value)}
                                placeholder="¿Cómo quieres que te llamemos?"
                            />
                        </div>

                        <div className="form-group">
                            <label>Foto de perfil</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                {(fotoPreview || fotoUrl) && (
                                    <img
                                        src={fotoPreview || fotoUrl}
                                        alt="preview"
                                        className="perfil-avatar-img"
                                        style={{ width: '60px', height: '60px' }}
                                        onError={e => e.target.style.display = 'none'}
                                    />
                                )}
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleFotoSeleccionada}
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        style={{
                                            background: 'var(--mint-light)',
                                            color: 'var(--mint)',
                                            border: '1.5px solid var(--mint)',
                                            borderRadius: '8px',
                                            padding: '8px 16px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            fontFamily: 'inherit',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        📁 {fotoFile ? fotoFile.name : 'Seleccionar foto'}
                                    </button>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        JPG, PNG o WEBP · Máximo 6 MB · Recomendado: imagen cuadrada (ej. 400×400 px)
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Color de fondo del dashboard</label>
                            <div className="perfil-colores">
                                {COLORES_FONDO.map(c => (
                                    <div
                                        key={c.value}
                                        onClick={() => setFondoEdit(c.value)}
                                        title={c.label}
                                        className={`perfil-color-dot ${fondoEdit === c.value ? 'activo' : ''}`}
                                        style={{ background: c.value }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="modal-botones">
                            <button className="modal-btn-cancelar" onClick={() => { setMostrarConfig(false); setFotoFile(null); setFotoPreview(''); }}>
                                Cancelar
                            </button>
                            <button
                                className="modal-btn-guardar"
                                onClick={guardarPerfil}
                                disabled={guardando}
                                style={{
                                    background: guardadoOk ? '#D8F3DC' : '#2D6A4F',
                                    color: guardadoOk ? '#2D6A4F' : '#fff',
                                }}
                            >
                                {subiendoFoto ? '📤 Subiendo foto...' : guardadoOk ? '✓ Guardado' : guardando ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PerfilPage;