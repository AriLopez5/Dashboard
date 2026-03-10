import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import GastosPorCategoria from '../components/GastosPorCategoria';
import EvolucionGastos from '../components/EvolucionGastos';
import EntrenamientosPorTipo from '../components/EntrenamientosPorTipo';
import ComparativaMensual from '../components/ComparativaMensual';
import { exportarGastosCSV, exportarEntrenamientosCSV } from '../utils/exportarCSV';

function Dashboard({ gastos, entrenamientos, loading }) {

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <h1>🏠 Dashboard</h1>
                    <p className="page-subtitle">Visión general de tu actividad</p>
                </div>
                <div className="loading">Cargando datos...</div>
            </div>
        );
    }

    const totalGastos = gastos.reduce((sum, g) => sum + parseFloat(g.cantidad), 0);
    const cantidadGastos = gastos.length;
    const cantidadEntrenamientos = entrenamientos.length;
    const minutosEntrenamiento = entrenamientos.reduce((sum, e) => sum + (e.duracion || 0), 0);

    const dataGrafica = [
        { name: 'Gastos', value: cantidadGastos, color: '#667eea' },
        { name: 'Entrenamientos', value: cantidadEntrenamientos, color: '#f38181' }
    ];

    const gastosPorCategoria = gastos.reduce((acc, gasto) => {
        const cat = gasto.categoria || 'otros';
        acc[cat] = (acc[cat] || 0) + parseFloat(gasto.cantidad);
        return acc;
    }, {});

    const topCategorias = Object.entries(gastosPorCategoria)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="page-header">
                <h1>🏠 Dashboard</h1>
                <p className="page-subtitle">Visión general de tu actividad</p>
            </div>

            {/* Botones exportación */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button onClick={() => exportarGastosCSV(gastos)} className="btn-primary">
                    📥 Exportar Gastos ({gastos.length})
                </button>
                <button onClick={() => exportarEntrenamientosCSV(entrenamientos)} className="btn-primary">
                    📥 Exportar Entrenamientos ({entrenamientos.length})
                </button>
            </div>

            {/* Stat cards */}
            <div className="stats-container">
                <div className="stat-card">
                    <h3>💰 Total Gastado</h3>
                    <div className="stat-value">{totalGastos.toFixed(2)} €</div>
                    <div className="stat-label">{cantidadGastos} gastos</div>
                </div>
                <div className="stat-card">
                    <h3>💪 Entrenamientos</h3>
                    <div className="stat-value">{cantidadEntrenamientos}</div>
                    <div className="stat-label">{minutosEntrenamiento} minutos</div>
                </div>
            </div>

            {/* Comparativa Mensual */}
            <div style={{ marginBottom: '20px' }}>
                <ComparativaMensual gastos={gastos} entrenamientos={entrenamientos} />
            </div>

            {/* Distribución + Top Categorías */}
            <div className="grid-two-columns">
                <div className="chart-container">
                    <h2>📊 Distribución de Actividad</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dataGrafica}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                dataKey="value"
                            >
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
                        <div style={{ marginTop: '20px' }}>
                            {topCategorias.map(([categoria, total], index) => (
                                <div key={categoria} className="top-cat-item">
                                    <span className="top-cat-nombre">{index + 1}. {categoria}</span>
                                    <span className="top-cat-valor">{total.toFixed(2)} €</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Gráficas de barras */}
            <div className="grid-two-columns">
                <GastosPorCategoria gastos={gastos} />
                <EntrenamientosPorTipo entrenamientos={entrenamientos} />
            </div>

            {/* Evolución temporal */}
            <EvolucionGastos gastos={gastos} />
        </div>
    );
}

export default Dashboard;