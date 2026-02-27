function GastoItem({ gasto }) {
  const obtenerEmojiCategoria = (categoria) => {
    const emojis = {
      'alimentacion': '🍔',
      'transporte': '🚗',
      'ocio': '🎮',
      'deporte': '💪',
      'salud': '🏥',
      'otros': '📦'
    };
    return emojis[categoria] || '📦';
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  return (
    <div className={`gasto-item ${gasto.categoria}`}>
      <div className="gasto-info">
        <div className="gasto-categoria">
          {obtenerEmojiCategoria(gasto.categoria)} {gasto.categoria}
        </div>
        <div className="gasto-descripcion">
          {gasto.descripcion || 'Sin descripción'}
        </div>
        <div className="gasto-fecha">{formatearFecha(gasto.fecha)}</div>
      </div>
      <div className="gasto-cantidad">{gasto.cantidad.toFixed(2)} €</div>
    </div>
  );
}

export default GastoItem;