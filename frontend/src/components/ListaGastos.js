import GastoItem from './GastoItem';

function ListaGastos({ gastos, loading }) {
  if (loading) {
    return (
      <div className="card">
        <div className="loading">Cargando gastos...</div>
      </div>
    );
  }

  if (gastos.length === 0) {
    return (
      <div className="card">
        <h2>📋 Mis Gastos</h2>
        <div className="empty-message">
          No hay gastos registrados. ¡Añade tu primer gasto arriba! 👆
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📋 Mis Gastos</h2>
      <div className="gastos-list">
        {gastos.map((gasto) => (
          <GastoItem key={gasto.id} gasto={gasto} />
        ))}
      </div>
    </div>
  );
}

export default ListaGastos;