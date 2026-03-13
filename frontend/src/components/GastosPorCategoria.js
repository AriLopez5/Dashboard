import { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parseISO, startOfMonth, endOfMonth } from 'date-fns';
import SelectorMes from './SelectorMes';

function GastosPorCategoria({ gastos }) {
    const [mesSeleccionado, setMesSeleccionado] = useState(new Date());

    const inicioMes = startOfMonth(mesSeleccionado);
    const finMes = endOfMonth(mesSeleccionado);

    // Filtrar gastos del mes seleccionado
    const gastosDelMes = gastos.filter(g => {
        const fecha = parseISO(g.fecha);
        return fecha >= inicioMes && fecha <= finMes;
    });

    // Calcular gastos por categoría
    const gastosPorCategoria = gastosDelMes.reduce((acc, gasto) => {
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
            fill: colores[categoria]
        }))
        .sort((a, b) => b.total - a.total);

    if (data.length === 0) {
        return (
            <div className="chart-container">
                <h2>📊 Gastos por Categoría</h2>
                <SelectorMes
                    mesSeleccionado={mesSeleccionado}
                    onCambiarMes={setMesSeleccionado}
                />
                <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                    No hay datos para este mes
                </p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h2>📊 Gastos por Categoría</h2>

            <SelectorMes
                mesSeleccionado={mesSeleccionado}
                onCambiarMes={setMesSeleccionado}
            />

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div style={{ background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].payload.categoria}</p>
                                        <p style={{ margin: '5px 0 0 0', color: '#667eea' }}>{payload[0].value.toFixed(2)} €</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="total" name="Gasto (€)" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default GastosPorCategoria;