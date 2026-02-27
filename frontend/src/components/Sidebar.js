import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2> Dashboard</h2>
        <p>Personal</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          end
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink 
          to="/gastos" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <span className="nav-icon">💰</span>
          <span className="nav-text">Gastos</span>
        </NavLink>

        <NavLink 
          to="/deporte" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <span className="nav-icon">💪</span>
          <span className="nav-text">Deporte</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p>TFG ASIR 2026</p>
      </div>
    </aside>
  );
}

export default Sidebar;