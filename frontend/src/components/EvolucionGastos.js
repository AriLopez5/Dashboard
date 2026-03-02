import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

function EvolucionGastos({ gastos }) {
  // Obtener fecha actual
  const hoy = new Date();
  const inicioMes = startOfMonth(hoy);
  const finMes = endOfMonth(hoy);

  // Crear array con todos los días del mes
  const diasDelMes = eachDayOfInterval({ start: inicioMes, end: finMes });

  // Agrupar gastos por día
  const gastosPorDia = gastos.reduce((acc, gasto) => {
    const fecha = gasto.fecha;
    acc[fecha] = (acc[fecha] || 0) + parseFloat(gasto.cantidad);
    return acc;
  }, {});

  // Crear datos para la gráfica con acumulado
  let acumulado = 0;
  const data = diasDelMes.map(dia => {
    const fechaStr = format(dia, 'yyyy-MM-dd');
    const gastoDelDia = gastosPorDia[fechaStr] || 0;
    acumulado += gastoDelDia;

    return {
      fecha: format(dia, 'd MMM', { locale: es }),
      diario: parseFloat(gastoDelDia.toFixed(2)),
      acumulado: parseFloat(acumulado.toFixed(2))
    };
  });

  return (
    <div className="chart-container">
      <h2>📈 Evolución de Gastos - {format(hoy, 'MMMM yyyy', { locale: es })}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip 
            formatter={(value) => `${value.toFixed(2)} €`}
            contentStyle={{ background: '#fff', border: '1px solid #ccc' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="diario" 
            stroke="#667eea" 
            strokeWidth={2}
            name="Gasto Diario (€)"
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="acumulado" 
            stroke="#f38181" 
            strokeWidth={2}
            name="Acumulado (€)"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EvolucionGastos;