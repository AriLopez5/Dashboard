import { format, subMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

function SelectorMes({ mesSeleccionado, onCambiarMes }) {
  const handleMesAnterior = () => onCambiarMes(subMonths(mesSeleccionado, 1));

  const handleMesSiguiente = () => {
    const nuevoMes = addMonths(mesSeleccionado, 1);
    if (nuevoMes <= new Date()) onCambiarMes(nuevoMes);
  };

  const esHoy = format(mesSeleccionado, 'yyyy-MM') === format(new Date(), 'yyyy-MM');
  const esFuturo = mesSeleccionado > new Date();
  const deshabilitarSiguiente = esFuturo || esHoy;

  return (
    <div className="selector-mes">
      <button className="btn-primary selector-mes-btn" onClick={handleMesAnterior}>
        ◀ Anterior
      </button>

      <div className="selector-mes-centro">
        <div className="selector-mes-label">
          {format(mesSeleccionado, 'MMMM yyyy', { locale: es })}
        </div>
        {!esHoy && (
          <button className="selector-mes-hoy" onClick={() => onCambiarMes(new Date())}>
            Volver a hoy
          </button>
        )}
      </div>

      <button
        className="selector-mes-btn"
        onClick={handleMesSiguiente}
        disabled={deshabilitarSiguiente}
        style={{
          background: deshabilitarSiguiente ? 'var(--border)' : 'var(--mint)',
          color: deshabilitarSiguiente ? 'var(--text-muted)' : '#fff',
          cursor: deshabilitarSiguiente ? 'not-allowed' : 'pointer',
        }}
      >
        Siguiente ▶
      </button>
    </div>
  );
}

export default SelectorMes;