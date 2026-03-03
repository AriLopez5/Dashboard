import { useState, useMemo } from 'react';
import FormularioDeporte from '../components/FormularioDeporte';
import ModalEditarEntrenamiento from '../components/ModalEditarEntrenamiento';

function DeportePage({ entrenamientos, loading, onEntrenamientoCreado, onEliminarEntrenamiento, onActualizarEntrenamiento }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [entrenamientoEditando, setEntrenamientoEditando] = useState(null);

    // Agrupar entrenamientos por día
    const entrenamientosPorDia = useMemo(() => {
        const grupos = {};

        entrenamientos.forEach(entrenamiento => {
            const fecha = entrenamiento.fecha;
            if (!grupos[fecha]) {
                grupos[fecha] = [];
            }
            grupos[fecha].push(entrenamiento);
        });

        return Object.entries(grupos)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]));
    }, [entrenamientos]);

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

            {/* Botón añadir entrenamiento */}
            <div style={{ marginBottom: '20px' }}>
                <button
                    className="btn-primary"
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    style={{ width: 'auto', padding: '12px 30px' }}
                >
                    {mostrarFormulario ? '❌ Cerrar Formulario' : '➕ Añadir Nuevo Entrenamiento'}
                </button>
            </div>

            {/* Formulario */}
            {mostrarFormulario && (
                <FormularioDeporte onEntrenamientoCreado={(entrenamiento) => {
                    onEntrenamientoCreado(entrenamiento);
                    setMostrarFormulario(false);
                }} />
            )}

            {/* Lista por días */}
            {entrenamientosPorDia.length === 0 ? (
                <div className="empty-message">
                    No hay entrenamientos registrados. ¡Añade tu primer entrenamiento! 👆
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

                                                {/* Botones de acciones */}
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