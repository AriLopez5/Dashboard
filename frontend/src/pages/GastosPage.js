import { useState, useMemo } from 'react';
import FormularioGasto from '../components/FormularioGasto';
import ModalEditarGasto from '../components/ModalEditarGasto';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import { exportarGastosCSV } from '../utils/exportarCSV';
import { SkeletonListaItems } from '../components/SkeletonLoader';
import PresupuestoMensual from '../components/PresupuestoMensual';

function GastosPage({ gastos, loading, onGastoCreado, onEliminarGasto, onActualizarGasto }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [gastoEditando, setGastoEditando] = useState(null);
    const [filtros, setFiltros] = useState({
        busqueda: '', fechaInicio: '', fechaFin: '', categoria: '', cantidadMin: null, cantidadMax: null
    });

    const gastosFiltrados = useMemo(() => {
        return gastos.filter(gasto => {
            if (filtros.busqueda) {
                const b = filtros.busqueda.toLowerCase();
                if (!(gasto.descripcion || '').toLowerCase().includes(b) && !(gasto.categoria || '').toLowerCase().includes(b)) return false;
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
        gastosFiltrados.forEach(g => {
            if (!grupos[g.fecha]) grupos[g.fecha] = [];
            grupos[g.fecha].push(g);
        });
        return Object.entries(grupos).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    }, [gastosFiltrados]);

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr + 'T00:00:00');
        return fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const obtenerEmojiCategoria = (categoria) => {
        const emojis = { 'alimentacion': '🍔', 'transporte': '🚗', 'ocio': '🎮', 'deporte': '💪', 'salud': '🏥', 'otros': '📦' };
        return emojis[categoria] || '📦';
    };

    return (
        <div>
            <div className="page-header">
                <h1>💰 Gastos</h1>
                <p className="page-subtitle">Gestiona tus gastos diarios</p>
            </div>

            {loading ? <SkeletonListaItems /> : (
                <>
                    <PresupuestoMensual tipo="gastos" gastos={gastos} entrenamientos={[]} />

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <button className="btn-primary" onClick={() => setMostrarFormulario(!mostrarFormulario)} style={{ width: 'auto', padding: '12px 30px' }}>
                            {mostrarFormulario ? '❌ Cerrar Formulario' : '➕ Añadir Nuevo Gasto'}
                        </button>
                        <button onClick={() => exportarGastosCSV(gastosFiltrados)} style={{ padding: '12px 30px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
                            📥 Exportar a CSV ({gastosFiltrados.length})
                        </button>
                    </div>

                    {mostrarFormulario && (
                        <FormularioGasto onGastoCreado={(gasto) => { onGastoCreado(gasto); setMostrarFormulario(false); }} />
                    )}

                    <FiltrosBusqueda onFiltrar={setFiltros} tipo="gastos" />

                    {gastosFiltrados.length !== gastos.length && (
                        <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                            Mostrando <strong>{gastosFiltrados.length}</strong> de <strong>{gastos.length}</strong> gastos
                        </div>
                    )}

                    {gastosPorDia.length === 0 ? (
                        <div className="empty-message">
                            {filtros.busqueda || filtros.categoria || filtros.fechaInicio ? 'No se encontraron gastos con los filtros aplicados' : 'No hay gastos registrados. ¡Añade tu primer gasto! 👆'}
                        </div>
                    ) : (
                        <div className="days-list">
                            {gastosPorDia.map(([fecha, gastosDelDia]) => (
                                <div key={fecha} className="day-group">
                                    <div className="day-header">
                                        <div className="day-date">📅 {formatearFecha(fecha)}</div>
                                        <div className="day-total">Total: {gastosDelDia.reduce((sum, g) => sum + parseFloat(g.cantidad), 0).toFixed(2)} €</div>
                                    </div>
                                    <div className="day-items">
                                        {gastosDelDia.map(gasto => (
                                            <div key={gasto.id} className={`item ${gasto.categoria}`}>
                                                <div className="item-info">
                                                    <div className="item-categoria">{obtenerEmojiCategoria(gasto.categoria)} {gasto.categoria}</div>
                                                    <div className="item-descripcion">{gasto.descripcion || 'Sin descripción'}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <div className="item-cantidad">{parseFloat(gasto.cantidad).toFixed(2)} €</div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => setGastoEditando(gasto)} style={{ padding: '8px 12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }} title="Editar">✏️</button>
                                                        <button onClick={() => onEliminarGasto(gasto.id)} style={{ padding: '8px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }} title="Eliminar">🗑️</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {gastoEditando && (
                        <ModalEditarGasto gasto={gastoEditando} onClose={() => setGastoEditando(null)} onGuardar={onActualizarGasto} />
                    )}
                </>
            )}
        </div>
    );
}

export default GastosPage;