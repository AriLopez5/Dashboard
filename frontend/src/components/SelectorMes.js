import { format, subMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

function SelectorMes({ mesSeleccionado, onCambiarMes }) {
  const handleMesAnterior = () => {
    const nuevoMes = subMonths(mesSeleccionado, 1);
    onCambiarMes(nuevoMes);
  };

  const handleMesSiguiente = () => {
    const nuevoMes = addMonths(mesSeleccionado, 1);
    const hoy = new Date();
    
    // No permitir seleccionar meses futuros
    if (nuevoMes <= hoy) {
      onCambiarMes(nuevoMes);
    }
  };

  const handleHoy = () => {
    onCambiarMes(new Date());
  };

  const esHoy = format(mesSeleccionado, 'yyyy-MM') === format(new Date(), 'yyyy-MM');
  const esFuturo = mesSeleccionado > new Date();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '20px',
      padding: '15px',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <button
        onClick={handleMesAnterior}
        style={{
          padding: '10px 20px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'all 0.3s'
        }}
        onMouseOver={(e) => e.target.style.background = '#5568d3'}
        onMouseOut={(e) => e.target.style.background = '#667eea'}
      >
        ◀ Anterior
      </button>

      <div style={{
        minWidth: '200px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: '#333',
          textTransform: 'capitalize'
        }}>
          {format(mesSeleccionado, 'MMMM yyyy', { locale: es })}
        </div>
        {!esHoy && (
          <button
            onClick={handleHoy}
            style={{
              marginTop: '5px',
              padding: '5px 15px',
              background: '#f0f0f0',
              color: '#667eea',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Volver a hoy
          </button>
        )}
      </div>

      <button
        onClick={handleMesSiguiente}
        disabled={esFuturo || esHoy}
        style={{
          padding: '10px 20px',
          background: (esFuturo || esHoy) ? '#ccc' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: (esFuturo || esHoy) ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          transition: 'all 0.3s',
          opacity: (esFuturo || esHoy) ? 0.5 : 1
        }}
        onMouseOver={(e) => {
          if (!esFuturo && !esHoy) e.target.style.background = '#5568d3';
        }}
        onMouseOut={(e) => {
          if (!esFuturo && !esHoy) e.target.style.background = '#667eea';
        }}
      >
        Siguiente ▶
      </button>
    </div>
  );
}

export default SelectorMes;