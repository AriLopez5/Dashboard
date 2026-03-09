import { useState, useMemo } from 'react';
import FormularioGasto from '../components/FormularioGasto';
import ModalEditarGasto from '../components/ModalEditarGasto';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import { exportarGastosCSV } from '../utils/exportarCSV';

// ─── PALETA ──────────────────────────────────────────────────────────────────
const C = {
    bg: '#F7F6F3',
    surface: '#FFFFFF',
    border: '#EBEBEB',
    ink: '#1A1A1A',
    inkMid: '#6B6B6B',
    inkLight: '#B0B0B0',
    accent: '#2D6A4F',
    accentLight: '#D8F3DC',
    danger: '#E63946',
    dangerLight: '#FDECEA',
    edit: '#264653',
    editLight: '#D4E6EC',
};

const CATEGORIA_CONFIG = {
    alimentacion: { emoji: '🍔', color: '#E76F51', bg: '#FDE8E1' },
    transporte:   { emoji: '🚗', color: '#264653', bg: '#D4E6EC' },
    ocio:         { emoji: '🎮', color: '#8338EC', bg: '#EDE3FC' },
    deporte:      { emoji: '💪', color: '#2D6A4F', bg: '#D8F3DC' },
    salud:        { emoji: '🏥', color: '#F4A261', bg: '#FEF0E3' },
    otros:        { emoji: '📦', color: '#6B6B6B', bg: '#F0F0F0' },
};

const getCat = (cat) => CATEGORIA_CONFIG[cat] || CATEGORIA_CONFIG['otros'];

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
        transition: 'opacity 0.15s',
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
        transition: 'box-shadow 0.15s',
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
    // Grupo por día
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
    // Item de gasto
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
    catBadge: (cat) => ({
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: getCat(cat).bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        flexShrink: 0,
    }),
    catLabel: (cat) => ({
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: getCat(cat).color,
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
    amount: {
        fontSize: '17px',
        fontWeight: 700,
        color: C.ink,
        letterSpacing: '-0.02em',
        minWidth: '70px',
        textAlign: 'right',
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
        transition: 'opacity 0.15s',
    }),
    loading: {
        textAlign: 'center',
        padding: '64px 0',
        color: C.inkMid,
        fontSize: '15px',
    },
};

function GastosPage({ gastos, loading, onGastoCreado, onEliminarGasto, onActualizarGasto }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [gastoEditando, setGastoEditando] = useState(null);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        fechaInicio: '',
        fechaFin: '',
        categoria: '',
        cantidadMin: null,
        cantidadMax: null,
    });

    const gastosFiltrados = useMemo(() => {
        return gastos.filter(gasto => {
            if (filtros.busqueda) {
                const b = filtros.busqueda.toLowerCase();
                if (
                    !(gasto.descripcion || '').toLowerCase().includes(b) &&
                    !(gasto.categoria || '').toLowerCase().includes(b)
                ) return false;
            }
            if (filtros.fechaInicio && gasto.fecha < filtros.fechaInicio) return false;
            if (filtros.fechaFin && gasto.fecha > filtros.fechaFin) return false;
            if (filtros.categoria && gasto.categoria !== filtros.categoria) return false;
            if (filtros.cantidadMin !== null && parseFloat(gasto.cantidad) < filtros.cantidadMin) return false;
            if (filtros.cantidadMax !== null && parseFloat(gasto.cantidad) > filtros.cantidadMax) return false;
            return true;
        });
    }, [gastos, filtros]);

    const gastosPorDia = useMemo(() => {
        const grupos = {};
        gastosFiltrados.forEach(gasto => {
            if (!grupos[gasto.fecha]) grupos[gasto.fecha] = [];
            grupos[gasto.fecha].push(gasto);
        });
        return Object.entries(grupos).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    }, [gastosFiltrados]);

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr + 'T00:00:00');
        return fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return (
            <div style={s.page}>
                <div style={s.eyebrow}>Finanzas personales</div>
                <h1 style={s.title}>Gastos</h1>
                <div style={s.loading}>Cargando gastos…</div>
            </div>
        );
    }

    const hayFiltros = filtros.busqueda || filtros.categoria || filtros.fechaInicio || filtros.fechaFin;

    return (
        <div style={s.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

            {/* Header */}
            <div style={s.eyebrow}>Finanzas personales</div>
            <h1 style={s.title}>Gastos</h1>
            <p style={s.subtitle}>Gestiona tus gastos diarios</p>

            {/* Acciones */}
            <div style={s.actionRow}>
                <button
                    style={s.btnPrimary}
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                    {mostrarFormulario ? '✕ Cerrar' : '+ Añadir gasto'}
                </button>
                <button
                    style={s.btnSecondary}
                    onClick={() => exportarGastosCSV(gastosFiltrados)}
                >
                    ↓ Exportar CSV ({gastosFiltrados.length})
                </button>
            </div>

            {/* Formulario */}
            {mostrarFormulario && (
                <FormularioGasto onGastoCreado={(gasto) => {
                    onGastoCreado(gasto);
                    setMostrarFormulario(false);
                }} />
            )}

            {/* Filtros */}
            <FiltrosBusqueda onFiltrar={setFiltros} tipo="gastos" />

            {/* Banner de filtros activos */}
            {hayFiltros && gastosFiltrados.length !== gastos.length && (
                <div style={s.filterBanner}>
                    Mostrando <strong>{gastosFiltrados.length}</strong> de <strong>{gastos.length}</strong> gastos
                </div>
            )}

            {/* Lista vacía */}
            {gastosPorDia.length === 0 ? (
                <div style={s.emptyMsg}>
                    {hayFiltros
                        ? 'Sin resultados para los filtros aplicados.'
                        : 'Todavía no hay gastos. ¡Añade el primero!'}
                </div>
            ) : (
                gastosPorDia.map(([fecha, gastosDelDia]) => {
                    const totalDia = gastosDelDia.reduce((sum, g) => sum + parseFloat(g.cantidad), 0);

                    return (
                        <div key={fecha} style={s.dayGroup}>
                            {/* Cabecera del día */}
                            <div style={s.dayHeader}>
                                <span style={s.dayDate}>{formatearFecha(fecha)}</span>
                                <span style={s.dayTotal}>{totalDia.toFixed(2)} €</span>
                            </div>

                            {/* Items */}
                            {gastosDelDia.map(gasto => (
                                <div
                                    key={gasto.id}
                                    style={s.item}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                                >
                                    <div style={s.itemLeft}>
                                        <div style={s.catBadge(gasto.categoria)}>
                                            {getCat(gasto.categoria).emoji}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={s.catLabel(gasto.categoria)}>{gasto.categoria}</div>
                                            <div style={s.itemDesc}>{gasto.descripcion || 'Sin descripción'}</div>
                                            <div style={s.itemTime}>
                                                {new Date(gasto.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={s.itemRight}>
                                        <span style={s.amount}>{parseFloat(gasto.cantidad).toFixed(2)} €</span>
                                        <button
                                            style={s.iconBtn(C.editLight)}
                                            onClick={() => setGastoEditando(gasto)}
                                            title="Editar"
                                        >✏️</button>
                                        <button
                                            style={s.iconBtn(C.dangerLight)}
                                            onClick={() => onEliminarGasto(gasto.id)}
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
            {gastoEditando && (
                <ModalEditarGasto
                    gasto={gastoEditando}
                    onClose={() => setGastoEditando(null)}
                    onGuardar={onActualizarGasto}
                />
            )}
        </div>
    );
}

export default GastosPage;