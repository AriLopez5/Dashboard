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

    // Calcular totales
    const totalGastos = gastos.reduce((sum, g) => sum + parseFloat(g.cantidad), 0);
    const cantidadGastos = gastos.length;
    const cantidadEntrenamientos = entrenamientos.length;
    const minutosEntrenamiento = entrenamientos.reduce((sum, e) => sum + (e.duracion || 0), 0);

    // Datos para la gráfica circular
    const dataGrafica = [
        { name: 'Gastos', value: cantidadGastos, color: '#667eea' },
        { name: 'Entrenamientos', value: cantidadEntrenamientos, color: '#f38181' }
    ];

    // Gastos por categoría para el top
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
            {/* Botones de exportación rápida */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => exportarGastosCSV(gastos)}
                    style={{
                        padding: '10px 20px',
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}
                >
                    📥 Exportar Gastos ({gastos.length})
                </button>

                <button
                    onClick={() => exportarEntrenamientosCSV(entrenamientos)}
                    style={{
                        padding: '10px 20px',
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}
                >
                    📥 Exportar Entrenamientos ({entrenamientos.length})
                </button>
            </div>
            {/* Estadísticas */}
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

            {/* Comparativa Mensual - Ancho completo */}
            <ComparativaMensual gastos={gastos} entrenamientos={entrenamientos} />

            {/* Grid responsive 2 columnas en pantallas grandes */}
            <div className="grid-two-columns">
                {/* Gráfica circular */}
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
                                fill="#8884d8"
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

                {/* Top categorías */}
                {topCategorias.length > 0 && (
                    <div className="chart-container">
                        <h2>🔝 Top Categorías</h2>
                        <div style={{ marginTop: '40px' }}>
                            {topCategorias.map(([categoria, total], index) => (
                                <div
                                    key={categoria}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '15px',
                                        background: index % 2 === 0 ? '#f8f9fa' : 'white',
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}
                                >
                                    <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                                        {index + 1}. {categoria}
                                    </span>
                                    <span style={{ color: '#667eea', fontWeight: 'bold' }}>
                                        {total.toFixed(2)} €
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Gráficas de barras - 2 columnas en pantallas grandes */}
            <div className="grid-two-columns">
                <GastosPorCategoria gastos={gastos} />
                <EntrenamientosPorTipo entrenamientos={entrenamientos} />
            </div>

            {/* Evolución temporal - Ancho completo */}
            <EvolucionGastos gastos={gastos} />
        </div>
    );
}

export default Dashboard;