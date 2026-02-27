import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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

  // Gastos por categoría
  const gastosPorCategoria = gastos.reduce((acc, gasto) => {
    const cat = gasto.categoria || 'otros';
    acc[cat] = (acc[cat] || 0) + parseFloat(gasto.cantidad);
    return acc;
  }, {});

  const topCategorias = Object.entries(gastosPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1>🏠 Dashboard</h1>
        <p className="page-subtitle">Visión general de tu actividad</p>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
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

      {/* Gráfica Circular */}
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

      {/* Top Categorías de Gastos */}
      {topCategorias.length > 0 && (
        <div className="card">
          <h2>🔝 Top Categorías de Gastos</h2>
          <div style={{ marginTop: '20px' }}>
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

      {/* Últimos Registros */}
      <div className="card">
        <h2>📝 Últimos Registros</h2>
        
        {/* Últimos gastos */}
        <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#667eea' }}>
          💰 Últimos Gastos
        </h3>
        {gastos.slice(0, 3).map(gasto => (
          <div key={gasto.id} className={`item ${gasto.categoria}`} style={{ marginBottom: '10px' }}>
            <div className="item-info">
              <div className="item-categoria">{gasto.categoria}</div>
              <div className="item-descripcion">{gasto.descripcion || 'Sin descripción'}</div>
            </div>
            <div className="item-cantidad">{parseFloat(gasto.cantidad).toFixed(2)} €</div>
          </div>
        ))}

        {/* Últimos entrenamientos */}
        <h3 style={{ marginTop: '30px', marginBottom: '10px', color: '#f38181' }}>
          💪 Últimos Entrenamientos
        </h3>
        {entrenamientos.slice(0, 3).map(entrenamiento => (
          <div key={entrenamiento.id} className={`item ${entrenamiento.tipo.toLowerCase()}`} style={{ marginBottom: '10px' }}>
            <div className="item-info">
              <div className="item-categoria">{entrenamiento.tipo}</div>
              <div className="item-descripcion">{entrenamiento.ejercicios}</div>
            </div>
            <div className="item-cantidad">{entrenamiento.duracion} min</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;