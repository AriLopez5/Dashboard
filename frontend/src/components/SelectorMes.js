import { format, subMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

function SelectorMes({ mesSeleccionado, onCambiarMes }) {
  const handleMesAnterior = () => onCambiarMes(subMonths(mesSeleccionado, 1));

  const handleMesSiguiente = () => {
    const nuevoMes = addMonths(mesSeleccionado, 1);
    if (nuevoMes <= new Date()) onCambiarMes(nuevoMes);
  };

  const handleHoy = () => onCambiarMes(new Date());

  const esHoy = format(mesSeleccionado, 'yyyy-MM') === format(new Date(), 'yyyy-MM');
  const esFuturo = mesSeleccionado > new Date();
  const disabled = esFuturo || esHoy;

  const btnBase = {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s',
    cursor: 'pointer',
  };

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
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      flexWrap: 'nowrap',
    }}>
      <style>{`
        @media (max-width: 480px) {
          .selector-btn-texto { display: none; }
        }
      `}</style>

      {/* Botón anterior */}
      <button
        onClick={handleMesAnterior}
        style={{ ...btnBase, background: '#667eea' }}
        onMouseOver={e => e.currentTarget.style.background = '#5568d3'}
        onMouseOut={e => e.currentTarget.style.background = '#667eea'}
      >
        ◀ <span className="selector-btn-texto">Anterior</span>
      </button>

      {/* Botón siguiente */}
      <button
        onClick={handleMesSiguiente}
        disabled={disabled}
        style={{ ...btnBase, background: disabled ? '#ccc' : '#667eea', opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
        onMouseOver={e => { if (!disabled) e.currentTarget.style.background = '#5568d3'; }}
        onMouseOut={e => { if (!disabled) e.currentTarget.style.background = '#667eea'; }}
      >
        <span className="selector-btn-texto">Siguiente</span> ▶
      </button>
    </div>
  );
}

export default SelectorMes;