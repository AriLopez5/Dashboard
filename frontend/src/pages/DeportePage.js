import { useState, useMemo } from 'react';
import FormularioDeporte from '../components/FormularioDeporte';
import ModalEditarEntrenamiento from '../components/ModalEditarEntrenamiento';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import { exportarEntrenamientosCSV } from '../utils/exportarCSV';

function DeportePage({ entrenamientos, loading, onEntrenamientoCreado, onEliminarEntrenamiento, onActualizarEntrenamiento }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [entrenamientoEditando, setEntrenamientoEditando] = useState(null);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        fechaInicio: '',
        fechaFin: '',
        categoria: ''
    });

    // Aplicar filtros a los entrenamientos
    const entrenamientosFiltrados = useMemo(() => {
        return entrenamientos.filter(entrenamiento => {
            // Filtro por búsqueda
            if (filtros.busqueda) {
                const busquedaLower = filtros.busqueda.toLowerCase();
                const ejercicios = (entrenamiento.ejercicios || '').toLowerCase();
                const tipo = (entrenamiento.tipo || '').toLowerCase();
                if (!ejercicios.includes(busquedaLower) && !tipo.includes(busquedaLower)) {
                    return false;
                }
            }

            // Filtro por fecha inicio
            if (filtros.fechaInicio && entrenamiento.fecha < filtros.fechaInicio) {
                return false;
            }

            // Filtro por fecha fin
            if (filtros.fechaFin && entrenamiento.fecha > filtros.fechaFin) {
                return false;
            }

            // Filtro por tipo
            if (filtros.categoria && entrenamiento.tipo !== filtros.categoria) {
                return false;
            }

            return true;
        });
    }, [entrenamientos, filtros]);

    // Agrupar entrenamientos filtrados por día
    const entrenamientosPorDia = useMemo(() => {
        const grupos = {};

        entrenamientosFiltrados.forEach(entrenamiento => {
            const fecha = entrenamiento.fecha;
            if (!grupos[fecha]) {
                grupos[fecha] = [];
            }
            grupos[fecha].push(entrenamiento);
        });

        return Object.entries(grupos)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]));
    }, [entrenamientosFiltrados]);

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr + 'T00:00:00');
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    const obtenerEmojiTipo = (tipo) => {
        const emojis = {
            'gimnasio': '🏋️',
            'cardio': '🏃',
            'yoga': '🧘',
            'natacion': '🏊',
            'otro': '💪'
        };
        return emojis[tipo.toLowerCase()] || '💪';
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <h1>💪 Deporte</h1>
                    <p className="page-subtitle">Registra tus entrenamientos</p>
                </div>
                <div className="loading">Cargando entrenamientos...</div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <h1>💪 Deporte</h1>
                <p className="page-subtitle">Registra tus entrenamientos</p>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                    className="btn-primary"
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    style={{ width: 'auto', padding: '12px 30px' }}
                >
                    {mostrarFormulario ? '❌ Cerrar Formulario' : '➕ Añadir Nuevo Entrenamiento'}
                </button>

                <button
                    onClick={() => exportarEntrenamientosCSV(entrenamientosFiltrados)}
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
                    📥 Exportar a CSV ({entrenamientosFiltrados.length})
                </button>
            </div>

            {/* Formulario */}
            {mostrarFormulario && (
                <FormularioDeporte onEntrenamientoCreado={(entrenamiento) => {
                    onEntrenamientoCreado(entrenamiento);
                    setMostrarFormulario(false);
                }} />
            )}

            {/* Filtros y búsqueda */}
            <FiltrosBusqueda
                onFiltrar={setFiltros}
                tipo="entrenamientos"
            />

            {/* Resumen de resultados */}
            {entrenamientosFiltrados.length !== entrenamientos.length && (
                <div style={{
                    padding: '15px',
                    background: '#e3f2fd',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    Mostrando <strong>{entrenamientosFiltrados.length}</strong> de <strong>{entrenamientos.length}</strong> entrenamientos
                </div>
            )}

            {/* Lista por días */}
            {entrenamientosPorDia.length === 0 ? (
                <div className="empty-message">
                    {filtros.busqueda || filtros.categoria || filtros.fechaInicio ?
                        'No se encontraron entrenamientos con los filtros aplicados' :
                        'No hay entrenamientos registrados. ¡Añade tu primer entrenamiento! 👆'
                    }
                </div>
            ) : (
                <div className="days-list">
                    {entrenamientosPorDia.map(([fecha, entrenamientosDelDia]) => {
                        const minutosTotal = entrenamientosDelDia.reduce((sum, e) => sum + (e.duracion || 0), 0);

                        return (
                            <div key={fecha} className="day-group">
                                <div className="day-header">
                                    <div className="day-date">
                                        📅 {formatearFecha(fecha)}
                                    </div>
                                    <div className="day-total">
                                        Total: {minutosTotal} minutos
                                    </div>
                                </div>

                                <div className="day-items">
                                    {entrenamientosDelDia.map(entrenamiento => (
                                        <div key={entrenamiento.id} className={`item ${entrenamiento.tipo.toLowerCase()}`}>
                                            <div className="item-info">
                                                <div className="item-categoria">
                                                    {obtenerEmojiTipo(entrenamiento.tipo)} {entrenamiento.tipo}
                                                </div>
                                                <div className="item-descripcion">
                                                    {entrenamiento.ejercicios}
                                                </div>
                                                <div className="item-time">
                                                    {new Date(entrenamiento.created_at).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div className="item-cantidad">
                                                    {entrenamiento.duracion} min
                                                </div>

                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => setEntrenamientoEditando(entrenamiento)}
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
                                                        onClick={() => onEliminarEntrenamiento(entrenamiento.id)}
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