import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import SelectorMes from './SelectorMes';

function EvolucionGastos({ gastos }) {
    const [mesSeleccionado, setMesSeleccionado] = useState(new Date());

    const inicioMes = startOfMonth(mesSeleccionado);
    const finMes = endOfMonth(mesSeleccionado);

    // Crear array con todos los días del mes
    const diasDelMes = eachDayOfInterval({ start: inicioMes, end: finMes });

    // Filtrar gastos del mes seleccionado
    const gastosDelMes = gastos.filter(g => {
        const fecha = parseISO(g.fecha);
        return fecha >= inicioMes && fecha <= finMes;
    });

    // Agrupar gastos por día
    const gastosPorDia = gastosDelMes.reduce((acc, gasto) => {
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
            <h2>📈 Evolución de Gastos</h2>

            <SelectorMes
                mesSeleccionado={mesSeleccionado}
                onCambiarMes={setMesSeleccionado}
            />

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

            {/* Resumen del mes */}
            <div style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Total del mes</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                        {acumulado.toFixed(2)} €
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Gastos registrados</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                        {gastosDelMes.length}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Promedio diario</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                        {(acumulado / diasDelMes.length).toFixed(2)} €
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EvolucionGastos;