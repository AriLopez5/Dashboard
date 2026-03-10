/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import GastosPage from './pages/GastosPage';
import DeportePage from './pages/DeportePage';
import LoginPage from './pages/LoginPage';
import PerfilPage from './pages/PerfilPage';
import Toast from './components/Toast';
import { AuthProvider, useAuth } from './auth/AuthContext';

const API_URL = 'https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', fontFamily: 'DM Sans, sans-serif' }}>Cargando...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const { user, logout } = useAuth();
  const [gastos, setGastos] = useState([]);
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });
  const [fondo, setFondo] = useState(localStorage.getItem('dashboard_fondo') || '#F7F6F3');

  // Aplicar fondo cada vez que cambie
  useEffect(() => {
    document.documentElement.style.backgroundColor = fondo;
    document.body.style.backgroundColor = fondo;
    document.documentElement.style.setProperty('--bg-main', fondo);
    if (fondo === '#1E1E2E') {
      document.body.classList.add('tema-oscuro');
    } else {
      document.body.classList.remove('tema-oscuro');
    }
  }, [fondo]);

  useEffect(() => {
    if (user) cargarTodosDatos();
  }, [user]);

  const cargarTodosDatos = async () => {
    await Promise.all([cargarGastos(), cargarEntrenamientos()]);
  };

  const cargarGastos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/gastos`);
      if (!response.ok) throw new Error('Error al cargar gastos');
      const data = await response.json();
      setGastos(data.gastos || []);
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('Error al cargar los gastos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cargarEntrenamientos = async () => {
    try {
      const response = await fetch(`${API_URL}/entrenamientos`);
      if (!response.ok) throw new Error('Error al cargar entrenamientos');
      const data = await response.json();
      setEntrenamientos(data.entrenamientos || []);
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('Error al cargar entrenamientos', 'error');
    }
  };

  const handleGastoCreado = async (nuevoGasto) => {
    try {
      const response = await fetch(`${API_URL}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoGasto)
      });
      if (!response.ok) throw new Error('Error al crear el gasto');
      await cargarGastos();
      mostrarToast('✅ Gasto añadido correctamente', 'success');
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al añadir el gasto', 'error');
    }
  };

  const handleEntrenamientoCreado = async (nuevoEntrenamiento) => {
    try {
      const response = await fetch(`${API_URL}/entrenamientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEntrenamiento)
      });
      if (!response.ok) throw new Error('Error al crear el entrenamiento');
      await cargarEntrenamientos();
      mostrarToast('✅ Entrenamiento añadido correctamente', 'success');
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al añadir el entrenamiento', 'error');
    }
  };

  const handleEliminarGasto = async (gastoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) return;
    try {
      const response = await fetch(`${API_URL}/gastos/${gastoId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el gasto');
      await cargarGastos();
      mostrarToast('✅ Gasto eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al eliminar el gasto', 'error');
    }
  };

  const handleActualizarGasto = async (gastoId, datosActualizados) => {
    try {
      const response = await fetch(`${API_URL}/gastos/${gastoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });
      if (!response.ok) throw new Error('Error al actualizar el gasto');
      await cargarGastos();
      mostrarToast('✅ Gasto actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al actualizar el gasto', 'error');
    }
  };

  const handleEliminarEntrenamiento = async (entrenamientoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) return;
    try {
      const response = await fetch(`${API_URL}/entrenamientos/${entrenamientoId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el entrenamiento');
      await cargarEntrenamientos();
      mostrarToast('✅ Entrenamiento eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al eliminar el entrenamiento', 'error');
    }
  };

  const handleActualizarEntrenamiento = async (entrenamientoId, datosActualizados) => {
    try {
      const response = await fetch(`${API_URL}/entrenamientos/${entrenamientoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });
      if (!response.ok) throw new Error('Error al actualizar el entrenamiento');
      await cargarEntrenamientos();
      mostrarToast('✅ Entrenamiento actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al actualizar el entrenamiento', 'error');
    }
  };

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="app-container">
                <Sidebar onLogout={logout} />
                <main className="main-content">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Dashboard
                          gastos={gastos}
                          entrenamientos={entrenamientos}
                          loading={loading}
                        />
                      }
                    />
                    <Route
                      path="/gastos"
                      element={
                        <GastosPage
                          gastos={gastos}
                          loading={loading}
                          onGastoCreado={handleGastoCreado}
                          onEliminarGasto={handleEliminarGasto}
                          onActualizarGasto={handleActualizarGasto}
                        />
                      }
                    />
                    <Route
                      path="/deporte"
                      element={
                        <DeportePage
                          entrenamientos={entrenamientos}
                          loading={loading}
                          onEntrenamientoCreado={handleEntrenamientoCreado}
                          onEliminarEntrenamiento={handleEliminarEntrenamiento}
                          onActualizarEntrenamiento={handleActualizarEntrenamiento}
                        />
                      }
                    />
                    <Route
                      path="/perfil"
                      element={
                        <PerfilPage
                          gastos={gastos}
                          entrenamientos={entrenamientos}
                          onFondoChange={setFondo}
                        />
                      }
                    />
                  </Routes>
                </main>
                <Toast
                  mensaje={toast.mensaje}
                  tipo={toast.tipo}
                  visible={toast.visible}
                  onClose={() => setToast({ ...toast, visible: false })}
                />
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;