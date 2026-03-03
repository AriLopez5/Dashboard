import { useState } from 'react';

function FiltrosBusqueda({ onFiltrar, tipo = 'gastos' }) {
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [cantidadMin, setCantidadMin] = useState('');
  const [cantidadMax, setCantidadMax] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const aplicarFiltros = () => {
    onFiltrar({
      busqueda,
      fechaInicio,
      fechaFin,
      categoria: categoriaSeleccionada,
      cantidadMin: cantidadMin ? parseFloat(cantidadMin) : null,
      cantidadMax: cantidadMax ? parseFloat(cantidadMax) : null
    });
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFechaInicio('');
    setFechaFin('');
    setCategoriaSeleccionada('');
    setCantidadMin('');
    setCantidadMax('');
    onFiltrar({
      busqueda: '',
      fechaInicio: '',
      fechaFin: '',
      categoria: '',
      cantidadMin: null,
      cantidadMax: null
    });
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      {/* Barra de búsqueda principal */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por descripción..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            aplicarFiltros();
          }}
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          style={{
            padding: '12px 20px',
            background: mostrarFiltros ? '#667eea' : '#f0f0f0',
            color: mostrarFiltros ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {mostrarFiltros ? '✓ Filtros' : '⚙️ Filtros'}
        </button>
      </div>

      {/* Panel de filtros avanzados */}
      {mostrarFiltros && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {/* Filtro por rango de fechas */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>
              Desde
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>
              Hasta
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            />
          </div>

          {/* Filtro por categoría/tipo */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>
              {tipo === 'gastos' ? 'Categoría' : 'Tipo'}
            </label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            >
              <option value="">Todas</option>
              {tipo === 'gastos' ? (
                <>
                  <option value="alimentacion">🍔 Alimentación</option>
                  <option value="transporte">🚗 Transporte</option>
                  <option value="ocio">🎮 Ocio</option>
                  <option value="deporte">💪 Deporte</option>
                  <option value="salud">🏥 Salud</option>
                  <option value="otros">📦 Otros</option>
                </>
              ) : (
                <>
                  <option value="Gimnasio">🏋️ Gimnasio</option>
                  <option value="Cardio">🏃 Cardio</option>
                  <option value="Yoga">🧘 Yoga</option>
                  <option value="Natacion">🏊 Natación</option>
                  <option value="Otro">💪 Otro</option>
                </>
              )}
            </select>
          </div>

          {/* Filtro por cantidad (solo para gastos) */}
          {tipo === 'gastos' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>
                  Cantidad mínima (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={cantidadMin}
                  onChange={(e) => setCantidadMin(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>
                  Cantidad máxima (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1000.00"
                  value={cantidadMax}
                  onChange={(e) => setCantidadMax(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <button
              onClick={aplicarFiltros}
              style={{
                flex: 1,
                padding: '8px 15px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Aplicar
            </button>
            <button
              onClick={limpiarFiltros}
              style={{
                flex: 1,
                padding: '8px 15px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FiltrosBusqueda;