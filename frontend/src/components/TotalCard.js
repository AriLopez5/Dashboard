function TotalCard({ total, count }) {
  return (
    <div className="total-card">
      <h2>Total Gastado</h2>
      <p className="total-amount">{total.toFixed(2)} €</p>
      <p className="total-count">
        {count} gasto{count !== 1 ? 's' : ''} registrado{count !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default TotalCard;