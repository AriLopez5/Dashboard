import { startOfMonth, endOfMonth, subMonths, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

function ComparativaMensual({ gastos, entrenamientos }) {
  const hoy = new Date();
  
  // Mes actual
  const inicioMesActual = startOfMonth(hoy);
  const finMesActual = endOfMonth(hoy);
  
  // Mes anterior
  const mesAnterior = subMonths(hoy, 1);
  const inicioMesAnterior = startOfMonth(mesAnterior);
  const finMesAnterior = endOfMonth(mesAnterior);

  // Filtrar gastos por mes
  const gastosActual = gastos.filter(g => {
    const fecha = parseISO(g.fecha);
    return fecha >= inicioMesActual && fecha <= finMesActual;
  });

  const gastosAnterior = gastos.filter(g => {
    const fecha = parseISO(g.fecha);
    return fecha >= inicioMesAnterior && fecha <= finMesAnterior;
  });

  // Filtrar entrenamientos por mes
  const entrenamientosActual = entrenamientos.filter(e => {
    const fecha = parseISO(e.fecha);
    return fecha >= inicioMesActual && fecha <= finMesActual;
  });

  const entrenamientosAnterior = entrenamientos.filter(e => {
    const fecha = parseISO(e.fecha);
    return fecha >= inicioMesAnterior && fecha <= finMesAnterior;
  });

  // Calcular totales
  const totalGastosActual = gastosActual.reduce((sum, g) => sum + parseFloat(g.cantidad), 0);
  const totalGastosAnterior = gastosAnterior.reduce((sum, g) => sum + parseFloat(g.cantidad), 0);
  
  const minutosActual = entrenamientosActual.reduce((sum, e) => sum + (e.duracion || 0), 0);
  const minutosAnterior = entrenamientosAnterior.reduce((sum, e) => sum + (e.duracion || 0), 0);

  // Calcular diferencias
  const difGastos = totalGastosActual - totalGastosAnterior;
  const difEntrenamientos = minutosActual - minutosAnterior;

  const porcentajeGastos = totalGastosAnterior > 0 
    ? ((difGastos / totalGastosAnterior) * 100).toFixed(1)
    : 0;
    
  const porcentajeEntrenamientos = minutosAnterior > 0
    ? ((difEntrenamientos / minutosAnterior) * 100).toFixed(1)
    : 0;

  return (
    <div className="card">
      <h2>📉 Comparativa Mensual</h2>
      
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginTop: '20px' 
        }}>
        {/* Gastos */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '10px',
          borderLeft: '4px solid #667eea'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>💰 Gastos</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {format(mesAnterior, 'MMMM', { locale: es })}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {totalGastosAnterior.toFixed(2)} €
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {format(hoy, 'MMMM', { locale: es })}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {totalGastosActual.toFixed(2)} €
            </div>
          </div>

          <div style={{ 
            marginTop: '15px', 
            paddingTop: '15px', 
            borderTop: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ 
              fontSize: '1.2rem',
              color: difGastos > 0 ? '#f44336' : '#4caf50'
            }}>
              {difGastos > 0 ? '📈' : '📉'}
            </span>
            <div>
              <div style={{ 
                fontWeight: 'bold', 
                color: difGastos > 0 ? '#f44336' : '#4caf50'
              }}>
                {difGastos > 0 ? '+' : ''}{difGastos.toFixed(2)} €
              </div>
              <div style={{ fontSize: '0.85rem', color: '#999' }}>
                {porcentajeGastos > 0 ? '+' : ''}{porcentajeGastos}% vs mes anterior
              </div>
            </div>
          </div>
        </div>

        {/* Entrenamientos */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '10px',
          borderLeft: '4px solid #f38181'
        }}>
          <h3 style={{ color: '#f38181', marginBottom: '15px' }}>💪 Entrenamientos</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {format(mesAnterior, 'MMMM', { locale: es })}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {minutosAnterior} min
            </div>
            <div style={{ fontSize: '0.85rem', color: '#999' }}>
              {entrenamientosAnterior.length} sesiones
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {format(hoy, 'MMMM', { locale: es })}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {minutosActual} min
            </div>
            <div style={{ fontSize: '0.85rem', color: '#999' }}>
              {entrenamientosActual.length} sesiones
            </div>
          </div>

          <div style={{ 
            marginTop: '15px', 
            paddingTop: '15px', 
            borderTop: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ 
              fontSize: '1.2rem',
              color: difEntrenamientos > 0 ? '#4caf50' : '#f44336'
            }}>
              {difEntrenamientos > 0 ? '📈' : '📉'}
            </span>
            <div>
              <div style={{ 
                fontWeight: 'bold', 
                color: difEntrenamientos > 0 ? '#4caf50' : '#f44336'
              }}>
                {difEntrenamientos > 0 ? '+' : ''}{difEntrenamientos} min
              </div>
              <div style={{ fontSize: '0.85rem', color: '#999' }}>
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