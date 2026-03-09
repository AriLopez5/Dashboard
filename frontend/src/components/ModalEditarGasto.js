import { useState } from 'react';

function ModalEditarGasto({ gasto, onClose, onGuardar }) {
    const [cantidad, setCantidad] = useState(gasto.cantidad);
    const [categoria, setCategoria] = useState(gasto.categoria);
    const [descripcion, setDescripcion] = useState(gasto.descripcion || '');
    const [fecha, setFecha] = useState(gasto.fecha);

    const handleSubmit = (e) => {
        e.preventDefault();
        onGuardar(gasto.id, {
            cantidad: parseFloat(cantidad),
            categoria,
            descripcion,
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
                <h2>✏️ Editar Gasto</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="cantidad">Cantidad (€)</label>
                        <input
                            type="number"
                            id="cantidad"
                            step="0.01"
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
                            <option value="alimentacion">🍔 Alimentación</option>
                            <option value="transporte">🚗 Transporte</option>
                            <option value="ocio">🎮 Ocio</option>
                            <option value="deporte">💪 Deporte</option>
                            <option value="salud">🏥 Salud</option>
                            <option value="otros">📦 Otros</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <input
                            type="text"
                            id="descripcion"
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

export default ModalEditarGasto;