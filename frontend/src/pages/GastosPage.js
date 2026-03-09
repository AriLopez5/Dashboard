import { useState, useMemo } from 'react';
import FormularioGasto from '../components/FormularioGasto';
import ModalEditarGasto from '../components/ModalEditarGasto';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import { exportarGastosCSV } from '../utils/exportarCSV';

function GastosPage({ gastos, loading, onGastoCreado, onEliminarGasto, onActualizarGasto }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [gastoEditando, setGastoEditando] = useState(null);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        fechaInicio: '',
        fechaFin: '',
        categoria: '',
        cantidadMin: null,
        cantidadMax: null
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

    const obtenerEmojiCategoria = (categoria) => {
        const emojis = {
            'alimentacion': '🍔',
            'transporte':   '🚗',
            'ocio':         '🎮',
            'deporte':      '💪',
            'salud':        '🏥',
            'otros':        '📦'
        };
        return emojis[categoria] || '📦';
    };

    const getBadgeBg = (categoria) => {
        const bgs = {
            'alimentacion': '#FDE8E1',
            'transporte':   '#D4E6EC',
            'ocio':         '#EDE3FC',
            'deporte':      '#D8F3DC',
            'salud':        '#FEF0E3',
            'otros':        '#F0F0F0'
        };
        return bgs[categoria] || '#F0F0F0';
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <h1>💰 Gastos</h1>
                    <p className="page-subtitle">Gestiona tus gastos diarios</p>
                </div>
                <div className="loading">Cargando gastos...</div>
            </div>
        );
    }

    const hayFiltros = filtros.busqueda || filtros.categoria || filtros.fechaInicio || filtros.fechaFin;

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <h1>💰 Gastos</h1>
                <p className="page-subtitle">Gestiona tus gastos diarios</p>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                    className="btn-primary"
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                    {mostrarFormulario ? '✕ Cerrar' : '+ Añadir gasto'}
                </button>
                <button
                    className="btn-secondary-peach"
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

            {/* Banner filtros activos */}
            {hayFiltros && gastosFiltrados.length !== gastos.length && (
                <div className="filter-banner">
                    Mostrando <strong>{gastosFiltrados.length}</strong> de <strong>{gastos.length}</strong> gastos
                </div>
            )}

            {/* Lista vacía */}
            {gastosPorDia.length === 0 ? (
                <div className="empty-message">
                    {hayFiltros
                        ? 'Sin resultados para los filtros aplicados.'
                        : 'No hay gastos registrados. ¡Añade tu primer gasto!'}
                </div>
            ) : (
                <div className="days-list">
                    {gastosPorDia.map(([fecha, gastosDelDia]) => {
                        const totalDia = gastosDelDia.reduce((sum, g) => sum + parseFloat(g.cantidad), 0);

                        return (
                            <div key={fecha} className="day-group">
                                {/* Cabecera del día */}
                                <div className="day-header">
                                    <span className="day-date">{formatearFecha(fecha)}</span>
                                    <span className="day-total">{totalDia.toFixed(2)} €</span>
                                </div>

                                <div className="day-items">
                                    {gastosDelDia.map(gasto => (
                                        <div key={gasto.id} className={`item ${gasto.categoria}`}>
                                            <div className="item-info" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                {/* Badge con emoji */}
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    background: getBadgeBg(gasto.categoria),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '18px',
                                                    flexShrink: 0
                                                }}>
                                                    {obtenerEmojiCategoria(gasto.categoria)}
                                                </div>
                                                {/* Texto */}
                                                <div>
                                                    <div className="item-categoria">{gasto.categoria}</div>
                                                    <div className="item-descripcion">{gasto.descripcion || 'Sin descripción'}</div>
                                                </div>
                                            </div>

                                            {/* Acciones */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="item-cantidad">
                                                    {parseFloat(gasto.cantidad).toFixed(2)} €
                                                </div>
                                                <button
                                                    onClick={() => setGastoEditando(gasto)}
                                                    title="Editar"
                                                    style={{
                                                        width: '34px', height: '34px', borderRadius: '8px',
                                                        background: '#D8F3DC', border: 'none', cursor: 'pointer', fontSize: '15px'
                                                    }}
                                                >✏️</button>
                                                <button
                                                    onClick={() => onEliminarGasto(gasto.id)}
                                                    title="Eliminar"
                                                    style={{
                                                        width: '34px', height: '34px', borderRadius: '8px',
                                                        background: '#FDECEA', border: 'none', cursor: 'pointer', fontSize: '15px'
                                                    }}
                                                >🗑️</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
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