import { useState, useMemo } from 'react';
import FormularioDeporte from '../components/FormularioDeporte';
import ModalEditarEntrenamiento from '../components/ModalEditarEntrenamiento';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import { exportarEntrenamientosCSV } from '../utils/exportarCSV';

// ─── PALETA ──────────────────────────────────────────────────────────────────
const C = {
    bg: '#F7F6F3',
    surface: '#FFFFFF',
    border: '#EBEBEB',
    ink: '#1A1A1A',
    inkMid: '#6B6B6B',
    inkLight: '#B0B0B0',
    accent: '#264653',
    accentLight: '#D4E6EC',
    danger: '#E63946',
    dangerLight: '#FDECEA',
    edit: '#2D6A4F',
    editLight: '#D8F3DC',
};

const TIPO_CONFIG = {
    gimnasio:  { emoji: '🏋️', color: '#8338EC', bg: '#EDE3FC' },
    cardio:    { emoji: '🏃', color: '#E76F51', bg: '#FDE8E1' },
    yoga:      { emoji: '🧘', color: '#2D6A4F', bg: '#D8F3DC' },
    natacion:  { emoji: '🏊', color: '#264653', bg: '#D4E6EC' },
    ciclismo:  { emoji: '🚴', color: '#F4A261', bg: '#FEF0E3' },
    running:   { emoji: '👟', color: '#E63946', bg: '#FDECEA' },
    otro:      { emoji: '💪', color: '#6B6B6B', bg: '#F0F0F0' },
};

const getTipo = (tipo) => TIPO_CONFIG[(tipo || '').toLowerCase()] || TIPO_CONFIG['otro'];

// ─── ESTILOS ─────────────────────────────────────────────────────────────────
const s = {
    page: {
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        background: C.bg,
        minHeight: '100vh',
        padding: '40px 48px',
        boxSizing: 'border-box',
    },
    eyebrow: {
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: C.inkMid,
        marginBottom: '6px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 700,
        color: C.ink,
        margin: 0,
        letterSpacing: '-0.02em',
    },
    subtitle: {
        fontSize: '14px',
        color: C.inkMid,
        marginTop: '4px',
        marginBottom: '32px',
    },
    actionRow: {
        display: 'flex',
        gap: '10px',
        marginBottom: '24px',
        flexWrap: 'wrap',
    },
    btnPrimary: {
        padding: '11px 24px',
        background: C.ink,
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
    },
    btnSecondary: {
        padding: '11px 24px',
        background: C.surface,
        color: C.ink,
        border: `1px solid ${C.border}`,
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
    },
    filterBanner: {
        padding: '12px 18px',
        background: C.accentLight,
        borderRadius: '10px',
        marginBottom: '20px',
        fontSize: '13px',
        color: C.accent,
        fontWeight: 500,
    },
    emptyMsg: {
        textAlign: 'center',
        padding: '64px 0',
        color: C.inkLight,
        fontSize: '15px',
    },
    dayGroup: {
        marginBottom: '28px',
    },
    dayHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    dayDate: {
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: C.inkMid,
    },
    dayTotal: {
        fontSize: '13px',
        fontWeight: 700,
        color: C.ink,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '8px',
        padding: '4px 12px',
    },
    item: {
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '14px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px',
        transition: 'box-shadow 0.15s',
    },
    itemLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flex: 1,
        minWidth: 0,
    },
    tipoBadge: (tipo) => ({
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: getTipo(tipo).bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        flexShrink: 0,
    }),
    tipoLabel: (tipo) => ({
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: getTipo(tipo).color,
        marginBottom: '2px',
    }),
    itemDesc: {
        fontSize: '14px',
        fontWeight: 500,
        color: C.ink,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    itemTime: {
        fontSize: '11px',
        color: C.inkLight,
        marginTop: '2px',
    },
    itemRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
        marginLeft: '16px',
    },
    duration: {
        fontSize: '17px',
        fontWeight: 700,
        color: C.ink,
        letterSpacing: '-0.02em',
        minWidth: '60px',
        textAlign: 'right',
    },
    durationUnit: {
        fontSize: '11px',
        fontWeight: 500,
        color: C.inkMid,
    },
    iconBtn: (bg) => ({
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        background: bg,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '15px',
    }),
    loading: {
        textAlign: 'center',
        padding: '64px 0',
        color: C.inkMid,
        fontSize: '15px',
    },
};

function DeportePage({ entrenamientos, loading, onEntrenamientoCreado, onEliminarEntrenamiento, onActualizarEntrenamiento }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [entrenamientoEditando, setEntrenamientoEditando] = useState(null);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        fechaInicio: '',
        fechaFin: '',
        categoria: '',
    });

    const entrenamientosFiltrados = useMemo(() => {
        return entrenamientos.filter(e => {
            if (filtros.busqueda) {
                const b = filtros.busqueda.toLowerCase();
                if (
                    !(e.ejercicios || '').toLowerCase().includes(b) &&
                    !(e.tipo || '').toLowerCase().includes(b)
                ) return false;
            }
            if (filtros.fechaInicio && e.fecha < filtros.fechaInicio) return false;
            if (filtros.fechaFin && e.fecha > filtros.fechaFin) return false;
            if (filtros.categoria && e.tipo !== filtros.categoria) return false;
            return true;
        });
    }, [entrenamientos, filtros]);

    const entrenamientosPorDia = useMemo(() => {
        const grupos = {};
        entrenamientosFiltrados.forEach(e => {
            if (!grupos[e.fecha]) grupos[e.fecha] = [];
            grupos[e.fecha].push(e);
        });
        return Object.entries(grupos).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    }, [entrenamientosFiltrados]);

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr + 'T00:00:00');
        return fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return (
            <div style={s.page}>
                <div style={s.eyebrow}>Actividad física</div>
                <h1 style={s.title}>Deporte</h1>
                <div style={s.loading}>Cargando entrenamientos…</div>
            </div>
        );
    }

    const hayFiltros = filtros.busqueda || filtros.categoria || filtros.fechaInicio || filtros.fechaFin;

    return (
        <div style={s.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

            {/* Header */}
            <div style={s.eyebrow}>Actividad física</div>
            <h1 style={s.title}>Deporte</h1>
            <p style={s.subtitle}>Registra y controla tus entrenamientos</p>

            {/* Acciones */}
            <div style={s.actionRow}>
                <button
                    style={s.btnPrimary}
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                    {mostrarFormulario ? '✕ Cerrar' : '+ Añadir entrenamiento'}
                </button>
                <button
                    style={s.btnSecondary}
                    onClick={() => exportarEntrenamientosCSV(entrenamientosFiltrados)}
                >
                    ↓ Exportar CSV ({entrenamientosFiltrados.length})
                </button>
            </div>

            {/* Formulario */}
            {mostrarFormulario && (
                <FormularioDeporte onEntrenamientoCreado={(e) => {
                    onEntrenamientoCreado(e);
                    setMostrarFormulario(false);
                }} />
            )}

            {/* Filtros */}
            <FiltrosBusqueda onFiltrar={setFiltros} tipo="entrenamientos" />

            {/* Banner filtros activos */}
            {hayFiltros && entrenamientosFiltrados.length !== entrenamientos.length && (
                <div style={s.filterBanner}>
                    Mostrando <strong>{entrenamientosFiltrados.length}</strong> de <strong>{entrenamientos.length}</strong> entrenamientos
                </div>
            )}

            {/* Lista vacía */}
            {entrenamientosPorDia.length === 0 ? (
                <div style={s.emptyMsg}>
                    {hayFiltros
                        ? 'Sin resultados para los filtros aplicados.'
                        : '¡Todavía no hay entrenamientos. Añade el primero!'}
                </div>
            ) : (
                entrenamientosPorDia.map(([fecha, entrenamientosDelDia]) => {
                    const minutosTotal = entrenamientosDelDia.reduce((sum, e) => sum + (e.duracion || 0), 0);

                    return (
                        <div key={fecha} style={s.dayGroup}>
                            {/* Cabecera del día */}
                            <div style={s.dayHeader}>
                                <span style={s.dayDate}>{formatearFecha(fecha)}</span>
                                <span style={s.dayTotal}>{minutosTotal} min</span>
                            </div>

                            {/* Items */}
                            {entrenamientosDelDia.map(entrenamiento => (
                                <div
                                    key={entrenamiento.id}
                                    style={s.item}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                                >
                                    <div style={s.itemLeft}>
                                        <div style={s.tipoBadge(entrenamiento.tipo)}>
                                            {getTipo(entrenamiento.tipo).emoji}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={s.tipoLabel(entrenamiento.tipo)}>{entrenamiento.tipo}</div>
                                            <div style={s.itemDesc}>{entrenamiento.ejercicios || 'Sin descripción'}</div>
                                            <div style={s.itemTime}>
                                                {new Date(entrenamiento.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={s.itemRight}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={s.duration}>{entrenamiento.duracion}</span>
                                            <span style={s.durationUnit}> min</span>
                                        </div>
                                        <button
                                            style={s.iconBtn(C.editLight)}
                                            onClick={() => setEntrenamientoEditando(entrenamiento)}
                                            title="Editar"
                                        >✏️</button>
                                        <button
                                            style={s.iconBtn(C.dangerLight)}
                                            onClick={() => onEliminarEntrenamiento(entrenamiento.id)}
                                            title="Eliminar"
                                        >🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })
            )}

            {/* Modal edición */}
            {entrenamientoEditando && (
                <ModalEditarEntrenamiento
                    entrenamiento={entrenamientoEditando}
                    onClose={() => setEntrenamientoEditando(null)}
                    onGuardar={onActualizarEntrenamiento}
                />
            )}
        </div>
    );
}

export default DeportePage;