function DeporteItem({ entrenamiento }) {
  const obtenerEmojiTipo = (tipo) => {
    const emojis = {
      'gimnasio':  '🏋️',
      'cardio':    '🏃',
      'yoga':      '🧘',
      'natacion':  '🏊',
      'ciclismo':  '🚴',
      'otro':      '⚽'
    };
    return emojis[tipo] || '⚽';
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  const formatearDuracion = (minutos) => {
    const mins = Number(minutos);
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}h ${m}min` : `${h}h`;
    }
    return `${mins} min`;
  };

  return (
    <div className={`gasto-item ${entrenamiento.tipo}`}>
      <div className="gasto-info">
        <div className="gasto-categoria">
          {obtenerEmojiTipo(entrenamiento.tipo)} {entrenamiento.tipo}
        </div>
        <div className="gasto-descripcion">
          {entrenamiento.ejercicios || 'Sin descripción'}
        </div>
        <div className="gasto-fecha">{formatearFecha(entrenamiento.fecha)}</div>
      </div>
      <div className="gasto-cantidad">{formatearDuracion(entrenamiento.duracion)}</div>
    </div>
  );
}

export default DeporteItem;