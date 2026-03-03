import { useState } from 'react';

function ModalEditarEntrenamiento({ entrenamiento, onClose, onGuardar }) {
    const [tipo, setTipo] = useState(entrenamiento.tipo);
    const [duracion, setDuracion] = useState(entrenamiento.duracion);
    const [ejercicios, setEjercicios] = useState(entrenamiento.ejercicios);
    const [fecha, setFecha] = useState(entrenamiento.fecha);

    const handleSubmit = (e) => {
        e.preventDefault();
        onGuardar(entrenamiento.id, {
            tipo,
            duracion: parseInt(duracion),
            ejercicios,
            fecha
        });
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <h2>✏️ Editar Entrenamiento</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="tipo">Tipo de Entrenamiento</label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            required
                        >
                            <option value="Gimnasio">🏋️ Gimnasio</option>
                            <option value="Cardio">🏃 Cardio</option>
                            <option value="Yoga">🧘 Yoga</option>
                            <option value="Natacion">🏊 Natación</option>
                            <option value="Otro">💪 Otro</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="duracion">Duración (minutos)</label>
                        <input
                            type="number"
                            id="duracion"
                            min="1"
                            value={duracion}
                            onChange={(e) => setDuracion(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ejercicios">Ejercicios / Descripción</label>
                        <textarea
                            id="ejercicios"
                            value={ejercicios}
                            onChange={(e) => setEjercicios(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fecha">Fecha</label>
                        <input
                            type="date"
                            id="fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                            Guardar Cambios
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '15px 30px',
                                background: '#ccc',
                                color: '#333',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalEditarEntrenamiento;