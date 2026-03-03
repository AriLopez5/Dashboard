import { useState } from 'react';

function FormularioDeporte({ onEntrenamientoCreado }) {
    const [tipo, setTipo] = useState('');
    const [duracion, setDuracion] = useState('');
    const [ejercicios, setEjercicios] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const nuevoEntrenamiento = {
            tipo,
            duracion: parseInt(duracion),
            ejercicios,
            fecha
        };

        onEntrenamientoCreado(nuevoEntrenamiento);

        // Limpiar formulario
        setTipo('');
        setDuracion('');
        setEjercicios('');
        setFecha(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="card">
            <h2>➕ Añadir Nuevo Entrenamiento</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="tipo">Tipo de Entrenamiento</label>
                    <select
                        id="tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        required
                    >
                        <option value="">-- Selecciona un tipo --</option>
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
                        placeholder="60"
                        value={duracion}
                        onChange={(e) => setDuracion(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="ejercicios">Ejercicios / Descripción</label>
                    <textarea
                        id="ejercicios"
                        placeholder="Ej: Pecho y tríceps - 3x10 press banca"
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

                <button type="submit" className="btn-primary">
                    Añadir Entrenamiento
                </button>
            </form>
        </div>
    );
}

export default FormularioDeporte;