import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const [abierto, setAbierto] = useState(false);

  // Cerrar sidebar al navegar en móvil
  const handleNavClick = () => {
    setAbierto(false);
  };

  return (
    <>
      {/* Botón hamburguesa — solo visible en móvil */}
      <button
        className="hamburger-btn"
        onClick={() => setAbierto(!abierto)}
        aria-label="Abrir menú"
      >
        {abierto ? '✕' : '☰'}
      </button>

      {/* Overlay oscuro al abrir en móvil */}
      {abierto && (
        <div className="sidebar-overlay" onClick={() => setAbierto(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${abierto ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🏠 Dashboard</h2>
          <p>Personal</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={handleNavClick}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/gastos"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={handleNavClick}
          >
            <span className="nav-icon">💰</span>
            <span className="nav-text">Gastos</span>
          </NavLink>

          <NavLink
            to="/deporte"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={handleNavClick}
          >
            <span className="nav-icon">💪</span>
            <span className="nav-text">Deporte</span>
          </NavLink>

          <NavLink
            to="/perfil"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={handleNavClick}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Perfil</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>TFG ASIR 2026</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;