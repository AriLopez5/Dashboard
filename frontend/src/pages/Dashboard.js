import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState } from 'react';
import GastosPorCategoria from '../components/GastosPorCategoria';
import EvolucionGastos from '../components/EvolucionGastos';
import EntrenamientosPorTipo from '../components/EntrenamientosPorTipo';
import ComparativaMensual from '../components/ComparativaMensual';
import SelectorMes from '../components/SelectorMes';
import { exportarGastosCSV, exportarEntrenamientosCSV } from '../utils/exportarCSV';
import { SkeletonDashboard } from '../components/SkeletonLoader';

function Dashboard({ gastos, entrenamientos, loading }) {

    const [mesGastosSeleccionado, setMesGastosSeleccionado] = useState(new Date());
    const [mesEntrenamientosSeleccionado, setMesEntrenamientosSeleccionado] = useState(new Date());

    const mesClaveGastos = `${mesGastosSeleccionado.getFullYear()}-${String(mesGastosSeleccionado.getMonth() + 1).padStart(2, '0')}`;
    const mesClaveEntrenamientos = `${mesEntrenamientosSeleccionado.getFullYear()}-${String(mesEntrenamientosSeleccionado.getMonth() + 1).padStart(2, '0')}`;
    const mesEtiquetaGastos = mesGastosSeleccionado.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const mesEtiquetaEntrenamientos = mesEntrenamientosSeleccionado.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const obtenerMes = (fecha) => {
        if (!fecha) return null;
        if (typeof fecha === 'string' && /^\d{4}-\d{2}/.test(fecha)) return fecha.slice(0, 7);
        const fechaParseada = new Date(fecha);
        if (Number.isNaN(fechaParseada.getTime())) return null;
        return `${fechaParseada.getFullYear()}-${String(fechaParseada.getMonth() + 1).padStart(2, '0')}`;
    };

    const gastosMesActual = gastos.filter(g => obtenerMes(g.fecha) === mesClaveGastos);
    const entrenamientosMesActual = entrenamientos.filter(e => obtenerMes(e.fecha) === mesClaveEntrenamientos);

    const totalGastosMesActual = gastosMesActual.reduce((sum, g) => sum + parseFloat(g.cantidad || 0), 0);
    const minutosEntrenamientoMesActual = entrenamientosMesActual.reduce((sum, e) => sum + (e.duracion || 0), 0);
    const gastosPorCategoria = gastos.reduce((acc, g) => {
        const cat = g.categoria || 'otros';
        acc[cat] = (acc[cat] || 0) + parseFloat(g.cantidad);
        return acc;
    }, {});
    const topCategorias = Object.entries(gastosPorCategoria).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const dataGrafica = [
        { name: 'Gastos', value: gastos.length, color: '#667eea' },
        { name: 'Entrenamientos', value: entrenamientos.length, color: '#f38181' }
    ];

    return (
        <div className="dashboard">
            <div className="page-header">
                <h1>🏠 Dashboard</h1>
                <p className="page-subtitle">Visión general de tu actividad</p>
            </div>

            {loading ? <SkeletonDashboard /> : (
                <>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <button onClick={() => exportarGastosCSV(gastos)} style={{ padding: '10px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                            📥 Exportar Gastos ({gastos.length})
                        </button>
                        <button onClick={() => exportarEntrenamientosCSV(entrenamientos)} style={{ padding: '10px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                            📥 Exportar Entrenamientos ({entrenamientos.length})
                        </button>
                    </div>

                    <div className="stats-container">
                        <div className="stat-card">
                            <h3>💰 Total Gastado</h3>
                            <SelectorMes mesSeleccionado={mesGastosSeleccionado} onCambiarMes={setMesGastosSeleccionado} compact />
                            <div className="stat-value">{totalGastosMesActual.toFixed(2)} €</div>
                            <div className="stat-label">{gastosMesActual.length} gastos ({mesEtiquetaGastos})</div>
                        </div>
                        <div className="stat-card">
                            <h3>💪 Entrenamientos</h3>
                            <SelectorMes mesSeleccionado={mesEntrenamientosSeleccionado} onCambiarMes={setMesEntrenamientosSeleccionado} compact />
                            <div className="stat-value">{entrenamientosMesActual.length}</div>
                            <div className="stat-label">{minutosEntrenamientoMesActual} minutos ({mesEtiquetaEntrenamientos})</div>
                        </div>
                    </div>

                    <ComparativaMensual gastos={gastos} entrenamientos={entrenamientos} />

                    <div className="grid-two-columns">
                        <div className="chart-container">
                            <h2>📊 Distribución de Actividad</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={dataGrafica} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                                        {dataGrafica.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {topCategorias.length > 0 && (
                            <div className="chart-container">
                                <h2>🔝 Top Categorías</h2>
                                <div style={{ marginTop: '40px' }}>
                                    {topCategorias.map(([categoria, total], index) => (
                                        <div key={categoria} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: index % 2 === 0 ? '#f8f9fa' : 'white', borderRadius: '8px', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{index + 1}. {categoria}</span>
                                            <span style={{ color: '#667eea', fontWeight: 'bold' }}>{total.toFixed(2)} €</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid-two-columns">
                        <GastosPorCategoria gastos={gastos} />
                        <EntrenamientosPorTipo entrenamientos={entrenamientos} />
                    </div>

                    <EvolucionGastos gastos={gastos} />
                </>
            )}
        </div>
    );
}

export default Dashboard;