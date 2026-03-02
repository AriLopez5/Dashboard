import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function EntrenamientosPorTipo({ entrenamientos }) {
  // Calcular entrenamientos por tipo
  const entrenamientosPorTipo = entrenamientos.reduce((acc, entrenamiento) => {
    const tipo = entrenamiento.tipo || 'Otro';
    if (!acc[tipo]) {
      acc[tipo] = {
        cantidad: 0,
        minutos: 0
      };
    }
    acc[tipo].cantidad += 1;
    acc[tipo].minutos += entrenamiento.duracion || 0;
    return acc;
  }, {});

  // Emojis por tipo
  const emojis = {
    'Gimnasio': '🏋️',
    'Cardio': '🏃',
    'Yoga': '🧘',
    'Natacion': '🏊',
    'Otro': '💪'
  };

  // Convertir a array para la gráfica
  const data = Object.entries(entrenamientosPorTipo)
    .map(([tipo, stats]) => ({
      tipo: `${emojis[tipo] || '💪'} ${tipo}`,
      cantidad: stats.cantidad,
      minutos: stats.minutos
    }))
    .sort((a, b) => b.minutos - a.minutos);

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h2>🏋️ Entrenamientos por Tipo</h2>
        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          No hay datos suficientes para mostrar
        </p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h2>🏋️ Entrenamientos por Tipo</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tipo" />
          <YAxis yAxisId="left" orientation="left" stroke="#f38181" />
          <YAxis yAxisId="right" orientation="right" stroke="#667eea" />
          <Tooltip 
            contentStyle={{ background: '#fff', border: '1px solid #ccc' }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="minutos" fill="#f38181" name="Minutos" />
          <Bar yAxisId="right" dataKey="cantidad" fill="#667eea" name="Sesiones" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EntrenamientosPorTipo;