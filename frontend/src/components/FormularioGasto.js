import { useState } from 'react';

function FormularioGasto({ onGastoCreado }) {
    const [cantidad, setCantidad] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevoGasto = {
            cantidad: parseFloat(cantidad),
            categoria,
            descripcion,
            fecha
        };

        onGastoCreado(nuevoGasto);

        // Limpiar formulario
        setCantidad('');
        setCategoria('');
        setDescripcion('');
        setFecha(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="card">
            <h2>➕ Añadir Nuevo Gasto</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="cantidad">Cantidad (€)</label>
                    <input
                        type="number"
                        id="cantidad"
                        step="0.01"
                        placeholder="15.50"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="categoria">Categoría</label>
                    <select
                        id="categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        required
                    >
                        <option value="">-- Selecciona una categoría --</option>
                        <option value="alimentacion">🍔 Alimentación</option>
                        <option value="transporte">🚗 Transporte</option>
                        <option value="ocio">🎮 Ocio</option>
                        <option value="deporte">💪 Deporte</option>
                        <option value="salud">🏥 Salud</option>
                        <option value="otros">📦 Otros</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción (opcional)</label>
                    <input
                        type="text"
                        id="descripcion"
                        placeholder="Ej: Menú del día"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
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
                    Añadir Gasto
                </button>
            </form>
        </div>
    );
}

export default FormularioGasto;