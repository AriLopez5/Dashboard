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

    // Aplicar filtros a los gastos
    const gastosFiltrados = useMemo(() => {
        return gastos.filter(gasto => {
            // Filtro por búsqueda
            if (filtros.busqueda) {
                const busquedaLower = filtros.busqueda.toLowerCase();
                const descripcion = (gasto.descripcion || '').toLowerCase();
                const categoria = (gasto.categoria || '').toLowerCase();
                if (!descripcion.includes(busquedaLower) && !categoria.includes(busquedaLower)) {
                    return false;
                }
            }

            // Filtro por fecha inicio
            if (filtros.fechaInicio && gasto.fecha < filtros.fechaInicio) {
                return false;
            }

            // Filtro por fecha fin
            if (filtros.fechaFin && gasto.fecha > filtros.fechaFin) {
                return false;
            }

            // Filtro por categoría
            if (filtros.categoria && gasto.categoria !== filtros.categoria) {
                return false;
            }

            // Filtro por cantidad mínima
            if (filtros.cantidadMin !== null && parseFloat(gasto.cantidad) < filtros.cantidadMin) {
                return false;
            }

            // Filtro por cantidad máxima
            if (filtros.cantidadMax !== null && parseFloat(gasto.cantidad) > filtros.cantidadMax) {
                return false;
            }

            return true;
        });
    }, [gastos, filtros]);

    // Agrupar gastos filtrados por día
    const gastosPorDia = useMemo(() => {
        const grupos = {};

        gastosFiltrados.forEach(gasto => {
            const fecha = gasto.fecha;
            if (!grupos[fecha]) {
                grupos[fecha] = [];
            }
            grupos[fecha].push(gasto);
        });

        return Object.entries(grupos)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]));
    }, [gastosFiltrados]);

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr + 'T00:00:00');
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    const obtenerEmojiCategoria = (categoria) => {
        const emojis = {
            'alimentacion': '🍔',
            'transporte': '🚗',
            'ocio': '🎮',
            'deporte': '💪',
            'salud': '🏥',
            'otros': '📦'
        };
        return emojis[categoria] || '📦';
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
                    style={{ width: 'auto', padding: '12px 30px' }}
                >
                    {mostrarFormulario ? '❌ Cerrar Formulario' : '➕ Añadir Nuevo Gasto'}
                </button>

                <button
                    onClick={() => exportarGastosCSV(gastosFiltrados)}
                    style={{
                        padding: '12px 30px',
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                    }}
                >
                    📥 Exportar a CSV ({gastosFiltrados.length})
                </button>
            </div>

            {/* Formulario */}
            {mostrarFormulario && (
                <FormularioGasto onGastoCreado={(gasto) => {
                    onGastoCreado(gasto);
                    setMostrarFormulario(false);
                }} />
            )}

            {/* Filtros y búsqueda */}
            <FiltrosBusqueda
                onFiltrar={setFiltros}
                tipo="gastos"
            />

            {/* Resumen de resultados */}
            {gastosFiltrados.length !== gastos.length && (
                <div style={{
                    padding: '15px',
                    background: '#e3f2fd',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    Mostrando <strong>{gastosFiltrados.length}</strong> de <strong>{gastos.length}</strong> gastos
                </div>
            )}

            {/* Lista por días */}
            {gastosPorDia.length === 0 ? (
                <div className="empty-message">
                    {filtros.busqueda || filtros.categoria || filtros.fechaInicio ?
                        'No se encontraron gastos con los filtros aplicados' :
                        'No hay gastos registrados. ¡Añade tu primer gasto! 👆'
                    }
                </div>
            ) : (
                <div className="days-list">
                    {gastosPorDia.map(([fecha, gastosDelDia]) => {
                        const totalDia = gastosDelDia.reduce((sum, g) => sum + parseFloat(g.cantidad), 0);

                        return (
                            <div key={fecha} className="day-group">
                                <div className="day-header">
                                    <div className="day-date">
                                        📅 {formatearFecha(fecha)}
                                    </div>
                                    <div className="day-total">
                                        Total: {totalDia.toFixed(2)} €
                                    </div>
                                </div>

                                <div className="day-items">
                                    {gastosDelDia.map(gasto => (
                                        <div key={gasto.id} className={`item ${gasto.categoria}`}>
                                            <div className="item-info">
                                                <div className="item-categoria">
                                                    {obtenerEmojiCategoria(gasto.categoria)} {gasto.categoria}
                                                </div>
                                                <div className="item-descripcion">
                                                    {gasto.descripcion || 'Sin descripción'}
                                                </div>
                                                <div className="item-time">
                                                    {new Date(gasto.created_at).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div className="item-cantidad">
                                                    {parseFloat(gasto.cantidad).toFixed(2)} €
                                                </div>

                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => setGastoEditando(gasto)}
                                                        style={{
                                                            padding: '8px 12px',
                                                            background: '#667eea',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                            fontSize: '14px'
                                                        }}
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => onEliminarGasto(gasto.id)}
                                                        style={{
                                                            padding: '8px 12px',
                                                            background: '#f44336',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                            fontSize: '14px'
                                                        }}
                                                        title="Eliminar"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de edición */}
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