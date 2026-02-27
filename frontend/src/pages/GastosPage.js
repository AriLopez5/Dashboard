import { useState, useMemo } from 'react';
import FormularioGasto from '../components/FormularioGasto';

function GastosPage({ gastos, loading, onGastoCreado }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Agrupar gastos por día
  const gastosPorDia = useMemo(() => {
    const grupos = {};
    
    gastos.forEach(gasto => {
      const fecha = gasto.fecha;
      if (!grupos[fecha]) {
        grupos[fecha] = [];
      }
      grupos[fecha].push(gasto);
    });

    // Ordenar por fecha (más recientes primero)
    return Object.entries(grupos)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [gastos]);

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

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

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>💰 Gastos</h1>
          <p className="page-subtitle">Gestiona tus gastos diarios</p>
        </div>
        <div className="loading">Cargando gastos...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1>💰 Gastos</h1>
        <p className="page-subtitle">Gestiona tus gastos diarios</p>
      </div>

      {/* Botón añadir gasto */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn-primary"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          style={{ width: 'auto', padding: '12px 30px' }}
        >
          {mostrarFormulario ? '❌ Cerrar Formulario' : '➕ Añadir Nuevo Gasto'}
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <FormularioGasto onGastoCreado={(gasto) => {
          onGastoCreado(gasto);
          setMostrarFormulario(false);
        }} />
      )}

      {/* Lista por días */}
      {gastosPorDia.length === 0 ? (
        <div className="empty-message">
          No hay gastos registrados. ¡Añade tu primer gasto! 👆
        </div>
      ) : (
        <div className="days-list">
          {gastosPorDia.map(([fecha, gastosDelDia]) => {
            const totalDia = gastosDelDia.reduce((sum, g) => sum + parseFloat(g.cantidad), 0);
            
            return (
              <div key={fecha} className="day-group">
                <div className="day-header">
                  <div className="day-date">
                    📅 {formatearFecha(fecha)}
                  </div>
                  <div className="day-total">
                    Total: {totalDia.toFixed(2)} €
                  </div>
                </div>

                <div className="day-items">
                  {gastosDelDia.map(gasto => (
                    <div key={gasto.id} className={`item ${gasto.categoria}`}>
                      <div className="item-info">
                        <div className="item-categoria">
                          {obtenerEmojiCategoria(gasto.categoria)} {gasto.categoria}
                        </div>
                        <div className="item-descripcion">
                          {gasto.descripcion || 'Sin descripción'}
                        </div>
                        <div className="item-time">
                          {new Date(gasto.created_at).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <div className="item-cantidad">
                        {parseFloat(gasto.cantidad).toFixed(2)} €
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GastosPage;