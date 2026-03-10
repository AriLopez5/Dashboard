import { startOfMonth, endOfMonth, subMonths, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

function ComparativaMensual({ gastos, entrenamientos }) {
    const hoy = new Date();
    const inicioMesActual = startOfMonth(hoy);
    const finMesActual = endOfMonth(hoy);
    const mesAnterior = subMonths(hoy, 1);
    const inicioMesAnterior = startOfMonth(mesAnterior);
    const finMesAnterior = endOfMonth(mesAnterior);

    const gastosActual = gastos.filter(g => { const f = parseISO(g.fecha); return f >= inicioMesActual && f <= finMesActual; });
    const gastosAnterior = gastos.filter(g => { const f = parseISO(g.fecha); return f >= inicioMesAnterior && f <= finMesAnterior; });
    const entrenamientosActual = entrenamientos.filter(e => { const f = parseISO(e.fecha); return f >= inicioMesActual && f <= finMesActual; });
    const entrenamientosAnterior = entrenamientos.filter(e => { const f = parseISO(e.fecha); return f >= inicioMesAnterior && f <= finMesAnterior; });

    const totalGastosActual = gastosActual.reduce((sum, g) => sum + parseFloat(g.cantidad), 0);
    const totalGastosAnterior = gastosAnterior.reduce((sum, g) => sum + parseFloat(g.cantidad), 0);
    const minutosActual = entrenamientosActual.reduce((sum, e) => sum + (e.duracion || 0), 0);
    const minutosAnterior = entrenamientosAnterior.reduce((sum, e) => sum + (e.duracion || 0), 0);

    const difGastos = totalGastosActual - totalGastosAnterior;
    const difEntrenamientos = minutosActual - minutosAnterior;
    const porcentajeGastos = totalGastosAnterior > 0 ? ((difGastos / totalGastosAnterior) * 100).toFixed(1) : 0;
    const porcentajeEntrenamientos = minutosAnterior > 0 ? ((difEntrenamientos / minutosAnterior) * 100).toFixed(1) : 0;

    return (
        <div className="card">
            <h2>📉 Comparativa Mensual</h2>

            <div className="comparativa-grid">
                {/* Gastos */}
                <div className="comparativa-card comparativa-gastos">
                    <h3 className="comparativa-titulo comparativa-titulo-gastos">💰 Gastos</h3>

                    <div className="comparativa-mes">
                        <div className="comparativa-mes-label">{format(mesAnterior, 'MMMM', { locale: es })}</div>
                        <div className="comparativa-mes-valor">{totalGastosAnterior.toFixed(2)} €</div>
                    </div>

                    <div className="comparativa-mes">
                        <div className="comparativa-mes-label">{format(hoy, 'MMMM', { locale: es })}</div>
                        <div className="comparativa-mes-valor">{totalGastosActual.toFixed(2)} €</div>
                    </div>

                    <div className="comparativa-diff">
                        <span>{difGastos > 0 ? '📈' : '📉'}</span>
                        <div>
                            <div className={`comparativa-diff-valor ${difGastos > 0 ? 'negativo' : 'positivo'}`}>
                                {difGastos > 0 ? '+' : ''}{difGastos.toFixed(2)} €
                            </div>
                            <div className="comparativa-diff-pct">
                                {porcentajeGastos > 0 ? '+' : ''}{porcentajeGastos}% vs mes anterior
                            </div>
                        </div>
                    </div>
                </div>

                {/* Entrenamientos */}
                <div className="comparativa-card comparativa-entrenos">
                    <h3 className="comparativa-titulo comparativa-titulo-entrenos">💪 Entrenamientos</h3>

                    <div className="comparativa-mes">
                        <div className="comparativa-mes-label">{format(mesAnterior, 'MMMM', { locale: es })}</div>
                        <div className="comparativa-mes-valor">{minutosAnterior} min</div>
                        <div className="comparativa-sesiones">{entrenamientosAnterior.length} sesiones</div>
                    </div>

                    <div className="comparativa-mes">
                        <div className="comparativa-mes-label">{format(hoy, 'MMMM', { locale: es })}</div>
                        <div className="comparativa-mes-valor">{minutosActual} min</div>
                        <div className="comparativa-sesiones">{entrenamientosActual.length} sesiones</div>
                    </div>

                    <div className="comparativa-diff">
                        <span>{difEntrenamientos > 0 ? '📈' : '📉'}</span>
                        <div>
                            <div className={`comparativa-diff-valor ${difEntrenamientos > 0 ? 'positivo' : 'negativo'}`}>
                                {difEntrenamientos > 0 ? '+' : ''}{difEntrenamientos} min
                            </div>
                            <div className="comparativa-diff-pct">
                                {porcentajeEntrenamientos > 0 ? '+' : ''}{porcentajeEntrenamientos}% vs mes anterior
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComparativaMensual;