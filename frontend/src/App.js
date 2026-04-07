import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import GastosPage from './pages/GastosPage';
import DeportePage from './pages/DeportePage';
import PerfilPage from './pages/PerfilPage';
import ComunidadPage from './pages/ComunidadPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import Toast from './components/Toast';
import { AuthProvider, useAuth } from './auth/AuthContext';
import RegisterPage from './pages/RegisterPage';
const API_URL = 'https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod';

// ── Componente que protege las rutas privadas ─────────────────────────────────
function PrivateRoute({ children }) {
  const { user, loading: loadingAuth } = useAuth();
  if (loadingAuth) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ── Lógica principal de la app (dentro del AuthProvider) ──────────────────────
function AppInner() {
  const { user } = useAuth();
  const [email, setEmail] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fondo, setFondo] = useState(localStorage.getItem('dashboard_fondo') || '#F7F6F3');
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  useEffect(() => {
    if (user) {
      user.getUserAttributes((err, attrs) => {
        if (!err) {
          const emailAttr = attrs.find(a => a.Name === 'email');
          if (emailAttr) setEmail(emailAttr.Value);
        }
      });
    } else {
      setEmail(null);
    }
  }, [user]);

  // Aplicar fondo al document
  useEffect(() => {
    document.documentElement.style.backgroundColor = fondo;
    document.body.style.backgroundColor = fondo;
    document.documentElement.style.setProperty('--bg-main', fondo);
    if (fondo === '#1E1E2E') document.body.classList.add('tema-oscuro');
    else document.body.classList.remove('tema-oscuro');
  }, [fondo]);

  // ── Carga de datos ────────────────────────────────────────────────────────
  const cargarGastos = useCallback(async () => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/gastos?usuario_id=${encodeURIComponent(email)}`);
      const data = await res.json();
      setGastos(data.gastos || []);
    } catch (e) {
      console.error(e);
      mostrarToast('Error al cargar los gastos', 'error');
    } finally {
      setLoading(false);
    }
  }, [email]);

  const cargarEntrenamientos = useCallback(async () => {
    if (!email) return;
    try {
      const res = await fetch(`${API_URL}/entrenamientos?usuario_id=${encodeURIComponent(email)}`);
      const data = await res.json();
      setEntrenamientos(data.entrenamientos || []);
    } catch (e) {
      console.error(e);
      mostrarToast('Error al cargar entrenamientos', 'error');
    }
  }, [email]);

  const cargarTodosDatos = useCallback(async () => {
    await Promise.all([cargarGastos(), cargarEntrenamientos()]);
  }, [cargarGastos, cargarEntrenamientos]);

  useEffect(() => {
    if (email) cargarTodosDatos();
  }, [email, cargarTodosDatos]);

  // ── Handlers gastos ───────────────────────────────────────────────────────
  const handleGastoCreado = async (nuevoGasto) => {
    try {
      const res = await fetch(`${API_URL}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevoGasto, usuario_id: email }),
      });
      if (!res.ok) throw new Error();
      await cargarGastos();
      mostrarToast('✅ Gasto añadido correctamente', 'success');
    } catch {
      mostrarToast('❌ Error al añadir el gasto', 'error');
    }
  };

  const handleEliminarGasto = async (gastoId) => {
    if (!window.confirm('¿Seguro que quieres eliminar este gasto?')) return;
    try {
      const res = await fetch(`${API_URL}/gastos/${gastoId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      await cargarGastos();
      mostrarToast('✅ Gasto eliminado correctamente', 'success');
    } catch {
      mostrarToast('❌ Error al eliminar el gasto', 'error');
    }
  };

  const handleActualizarGasto = async (gastoId, datos) => {
    try {
      const res = await fetch(`${API_URL}/gastos/${gastoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error();
      await cargarGastos();
      mostrarToast('✅ Gasto actualizado correctamente', 'success');
    } catch {
      mostrarToast('❌ Error al actualizar el gasto', 'error');
    }
  };

  // ── Handlers entrenamientos ───────────────────────────────────────────────
  const handleEntrenamientoCreado = async (nuevoEntrenamiento) => {
    try {
      const res = await fetch(`${API_URL}/entrenamientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevoEntrenamiento, usuario_id: email }),
      });
      if (!res.ok) throw new Error();
      await cargarEntrenamientos();
      mostrarToast('✅ Entrenamiento añadido correctamente', 'success');
    } catch {
      mostrarToast('❌ Error al añadir el entrenamiento', 'error');
    }
  };

  const handleEliminarEntrenamiento = async (entrenamientoId) => {
    if (!window.confirm('¿Seguro que quieres eliminar este entrenamiento?')) return;
    try {
      const res = await fetch(`${API_URL}/entrenamientos/${entrenamientoId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      await cargarEntrenamientos();
      mostrarToast('✅ Entrenamiento eliminado correctamente', 'success');
    } catch {
      mostrarToast('❌ Error al eliminar el entrenamiento', 'error');
    }
  };

  const handleActualizarEntrenamiento = async (entrenamientoId, datos) => {
    try {
      const res = await fetch(`${API_URL}/entrenamientos/${entrenamientoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error();
      await cargarEntrenamientos();
      mostrarToast('✅ Entrenamiento actualizado correctamente', 'success');
    } catch {
      mostrarToast('❌ Error al actualizar el entrenamiento', 'error');
    }
  };

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo });
  };

  const handleFondoChange = (nuevoFondo) => {
    setFondo(nuevoFondo);
    localStorage.setItem('dashboard_fondo', nuevoFondo);
  };

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        {/* Rutas privadas */}
        <Route path="/*" element={
          <PrivateRoute>
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="dashboard" element={
                    <Dashboard
                      gastos={gastos}
                      entrenamientos={entrenamientos}
                      loading={loading}
                      email={email}
                    />
                  } />
                  <Route path="gastos" element={
                    <GastosPage
                      gastos={gastos}
                      loading={loading}
                      email={email}
                      onGastoCreado={handleGastoCreado}
                      onEliminarGasto={handleEliminarGasto}
                      onActualizarGasto={handleActualizarGasto}
                    />
                  } />
                  <Route path="deporte" element={
                    <DeportePage
                      entrenamientos={entrenamientos}
                      loading={loading}
                      email={email}
                      onEntrenamientoCreado={handleEntrenamientoCreado}
                      onEliminarEntrenamiento={handleEliminarEntrenamiento}
                      onActualizarEntrenamiento={handleActualizarEntrenamiento}
                    />
                  } />
                  <Route path="perfil" element={
                    <PerfilPage
                      gastos={gastos}
                      entrenamientos={entrenamientos}
                      onFondoChange={handleFondoChange}
                    />
                  } />
                  <Route path="comunidad" element={<ComunidadPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </div>
          </PrivateRoute>
        } />
      </Routes>

      <Toast
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        visible={toast.visible}
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />
    </Router>
  );
}

// ── Raíz con AuthProvider ─────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;