import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function GastosPorCategoria({ gastos }) {
  // Calcular gastos por categoría
  const gastosPorCategoria = gastos.reduce((acc, gasto) => {
    const cat = gasto.categoria || 'otros';
    acc[cat] = (acc[cat] || 0) + parseFloat(gasto.cantidad);
    return acc;
  }, {});

  // Emojis por categoría
  const emojis = {
    'alimentacion': '🍔',
    'transporte': '🚗',
    'ocio': '🎮',
    'deporte': '💪',
    'salud': '🏥',
    'otros': '📦'
  };

  // Colores por categoría
  const colores = {
    'alimentacion': '#ff6b6b',
    'transporte': '#4ecdc4',
    'ocio': '#95e1d3',
    'deporte': '#f38181',
    'salud': '#aa96da',
    'otros': '#fcbad3'
  };

  // Convertir a array para la gráfica
  const data = Object.entries(gastosPorCategoria)
    .map(([categoria, total]) => ({
      categoria: `${emojis[categoria]} ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`,
      total: parseFloat(total.toFixed(2)),
      color: colores[categoria]
    }))
    .sort((a, b) => b.total - a.total);

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h2>📊 Gastos por Categoría</h2>
        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          No hay datos suficientes para mostrar
        </p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h2>📊 Gastos por Categoría</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="categoria" />
          <YAxis />
          <Tooltip 
            formatter={(value) => `${value.toFixed(2)} €`}
            contentStyle={{ background: '#fff', border: '1px solid #ccc' }}
          />
          <Legend />
          <Bar dataKey="total" fill="#667eea" name="Gasto (€)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GastosPorCategoria;