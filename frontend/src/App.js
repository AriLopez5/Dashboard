import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import GastosPage from './pages/GastosPage';
import DeportePage from './pages/DeportePage';
import PerfilPage from './pages/PerfilPage';
import ComunidadPage from './pages/ComunidadPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import Toast from './components/Toast';
import { AuthProvider, useAuth } from './auth/AuthContext';

const API_URL = 'https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod';

function getEmail(user) {
  return new Promise((resolve) => {
    if (!user) return resolve(null);
    user.getUserAttributes((err, attrs) => {
      if (err || !attrs) return resolve(null);
      const emailAttr = attrs.find(a => a.Name === 'email');
      resolve(emailAttr ? emailAttr.Value : null);
    });
  });
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();
  const [email, setEmail] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fondo, setFondo] = useState(localStorage.getItem('dashboard_fondo') || '#F7F6F3');
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  // Aplicar fondo y tema oscuro
  useEffect(() => {
    document.documentElement.style.backgroundColor = fondo;
    document.body.style.backgroundColor = fondo;
    document.documentElement.style.setProperty('--bg-main', fondo);
    if (fondo === '#1E1E2E') document.body.classList.add('tema-oscuro');
    else document.body.classList.remove('tema-oscuro');
  }, [fondo]);

  // Obtener email cuando el usuario se autentica
  useEffect(() => {
    if (user) {
      getEmail(user).then(e => setEmail(e));
    } else {
      setEmail(null);
      setGastos([]);
      setEntrenamientos([]);
    }
  }, [user]);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo });
  };

  const cargarGastos = useCallback(async (uid) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/gastos?usuario_id=${encodeURIComponent(uid)}`);
      if (!response.ok) throw new Error('Error al cargar gastos');
      const data = await response.json();
      setGastos(data.gastos || []);
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('Error al cargar los gastos', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarEntrenamientos = useCallback(async (uid) => {
    try {
      const response = await fetch(`${API_URL}/entrenamientos?usuario_id=${encodeURIComponent(uid)}`);
      if (!response.ok) throw new Error('Error al cargar entrenamientos');
      const data = await response.json();
      setEntrenamientos(data.entrenamientos || []);
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('Error al cargar entrenamientos', 'error');
    }
  }, []);

  const cargarTodosDatos = useCallback(async (uid) => {
    await Promise.all([cargarGastos(uid), cargarEntrenamientos(uid)]);
  }, [cargarGastos, cargarEntrenamientos]);

  // Cargar datos cuando tengamos el email
  useEffect(() => {
    if (email) cargarTodosDatos(email);
  }, [email, cargarTodosDatos]);

  const handleGastoCreado = async (nuevoGasto) => {
    try {
      const response = await fetch(`${API_URL}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevoGasto, usuario_id: email })
      });
      if (!response.ok) throw new Error('Error al crear el gasto');
      await cargarGastos(email);
      mostrarToast('✅ Gasto añadido correctamente', 'success');
    } catch (error) {
      mostrarToast('❌ Error al añadir el gasto', 'error');
    }
  };

  const handleEntrenamientoCreado = async (nuevoEntrenamiento) => {
    try {
      const response = await fetch(`${API_URL}/entrenamientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevoEntrenamiento, usuario_id: email })
      });
      if (!response.ok) throw new Error('Error al crear el entrenamiento');
      await cargarEntrenamientos(email);
      mostrarToast('✅ Entrenamiento añadido correctamente', 'success');
    } catch (error) {
      mostrarToast('❌ Error al añadir el entrenamiento', 'error');
    }
  };

  const handleEliminarGasto = async (gastoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) return;
    try {
      const response = await fetch(`${API_URL}/gastos/${gastoId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el gasto');
      await cargarGastos(email);
      mostrarToast('✅ Gasto eliminado correctamente', 'success');
    } catch (error) {
      mostrarToast('❌ Error al eliminar el gasto', 'error');
    }
  };

  const handleActualizarGasto = async (gastoId, datosActualizados) => {
    try {
      const response = await fetch(`${API_URL}/gastos/${gastoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datosActualizados, usuario_id: email })
      });
      if (!response.ok) throw new Error('Error al actualizar el gasto');
      await cargarGastos(email);
      mostrarToast('✅ Gasto actualizado correctamente', 'success');
    } catch (error) {
      mostrarToast('❌ Error al actualizar el gasto', 'error');
    }
  };

  const handleEliminarEntrenamiento = async (entrenamientoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) return;
    try {
      const response = await fetch(`${API_URL}/entrenamientos/${entrenamientoId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el entrenamiento');
      await cargarEntrenamientos(email);
      mostrarToast('✅ Entrenamiento eliminado correctamente', 'success');
    } catch (error) {
      mostrarToast('❌ Error al eliminar el entrenamiento', 'error');
    }
  };

  const handleActualizarEntrenamiento = async (entrenamientoId, datosActualizados) => {
    try {
      const response = await fetch(`${API_URL}/entrenamientos/${entrenamientoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datosActualizados, usuario_id: email })
      });
      if (!response.ok) throw new Error('Error al actualizar el entrenamiento');
      await cargarEntrenamientos(email);
      mostrarToast('✅ Entrenamiento actualizado correctamente', 'success');
    } catch (error) {
      mostrarToast('❌ Error al actualizar el entrenamiento', 'error');
    }
  };

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/*" element={
        <PrivateRoute>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="dashboard" element={<Dashboard gastos={gastos} entrenamientos={entrenamientos} loading={loading} />} />
                <Route path="gastos" element={<GastosPage gastos={gastos} loading={loading} onGastoCreado={handleGastoCreado} onEliminarGasto={handleEliminarGasto} onActualizarGasto={handleActualizarGasto} />} />
                <Route path="deporte" element={<DeportePage entrenamientos={entrenamientos} loading={loading} onEntrenamientoCreado={handleEntrenamientoCreado} onEliminarEntrenamiento={handleEliminarEntrenamiento} onActualizarEntrenamiento={handleActualizarEntrenamiento} />} />
                <Route path="perfil" element={<PerfilPage gastos={gastos} entrenamientos={entrenamientos} onFondoChange={setFondo} />} />
                <Route path="comunidad" element={<ComunidadPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Toast mensaje={toast.mensaje} tipo={toast.tipo} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
          </div>
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
