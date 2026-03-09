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

    const entrenamientosFiltrados = useMemo(() => {
        return entrenamientos.filter(entrenamiento => {
            if (filtros.busqueda) {
                const b = filtros.busqueda.toLowerCase();
                if (
                    !(entrenamiento.ejercicios || '').toLowerCase().includes(b) &&
                    !(entrenamiento.tipo || '').toLowerCase().includes(b)
                ) return false;
            }
            if (filtros.fechaInicio && entrenamiento.fecha < filtros.fechaInicio) return false;
            if (filtros.fechaFin && entrenamiento.fecha > filtros.fechaFin) return false;
            if (filtros.categoria && entrenamiento.tipo !== filtros.categoria) return false;
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

    const obtenerEmojiTipo = (tipo) => {
        const emojis = {
            'gimnasio': '🏋️',
            'cardio':   '🏃',
            'yoga':     '🧘',
            'natacion': '🏊',
            'otro':     '💪'
        };
        return emojis[(tipo || '').toLowerCase()] || '💪';
    };

    const getBadgeBg = (tipo) => {
        const bgs = {
            'gimnasio': '#EDE3FC',
            'cardio':   '#FDE8E1',
            'yoga':     '#D8F3DC',
            'natacion': '#D4E6EC',
            'otro':     '#F0F0F0'
        };
        return bgs[(tipo || '').toLowerCase()] || '#F0F0F0';
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

    const hayFiltros = filtros.busqueda || filtros.categoria || filtros.fechaInicio || filtros.fechaFin;

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
                >
                    {mostrarFormulario ? '✕ Cerrar' : '+ Añadir entrenamiento'}
                </button>
                <button
                    className="btn-secondary"
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
                <div className="filter-banner">
                    Mostrando <strong>{entrenamientosFiltrados.length}</strong> de <strong>{entrenamientos.length}</strong> entrenamientos
                </div>
            )}

            {/* Lista vacía */}
            {entrenamientosPorDia.length === 0 ? (
                <div className="empty-message">
                    {hayFiltros
                        ? 'Sin resultados para los filtros aplicados.'
                        : '¡Todavía no hay entrenamientos. Añade el primero!'}
                </div>
            ) : (
                <div className="days-list">
                    {entrenamientosPorDia.map(([fecha, entrenamientosDelDia]) => {
                        const minutosTotal = entrenamientosDelDia.reduce((sum, e) => sum + (e.duracion || 0), 0);

                        return (
                            <div key={fecha} className="day-group">
                                {/* Cabecera del día */}
                                <div className="day-header">
                                    <span className="day-date">{formatearFecha(fecha)}</span>
                                    <span className="day-total">{minutosTotal} min</span>
                                </div>

                                <div className="day-items">
                                    {entrenamientosDelDia.map(entrenamiento => (
                                        <div key={entrenamiento.id} className={`item ${(entrenamiento.tipo || '').toLowerCase()}`}>
                                            <div className="item-info" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                {/* Badge con emoji */}
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    background: getBadgeBg(entrenamiento.tipo),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '18px',
                                                    flexShrink: 0
                                                }}>
                                                    {obtenerEmojiTipo(entrenamiento.tipo)}
                                                </div>
                                                {/* Texto */}
                                                <div>
                                                    <div className="item-categoria">{entrenamiento.tipo}</div>
                                                    <div className="item-descripcion">{entrenamiento.ejercicios || 'Sin descripción'}</div>
                                                    <div className="item-time">
                                                        {entrenamiento.created_at
                                                            ? new Date(entrenamiento.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                                                            : ''}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Acciones */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="item-cantidad">
                                                    {entrenamiento.duracion} min
                                                </div>
                                                <button
                                                    onClick={() => setEntrenamientoEditando(entrenamiento)}
                                                    title="Editar"
                                                    style={{
                                                        width: '34px', height: '34px', borderRadius: '8px',
                                                        background: '#D8F3DC', border: 'none', cursor: 'pointer', fontSize: '15px'
                                                    }}
                                                >✏️</button>
                                                <button
                                                    onClick={() => onEliminarEntrenamiento(entrenamiento.id)}
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