import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import GastosPage from './pages/GastosPage';
import DeportePage from './pages/DeportePage';
import Toast from './components/Toast';

// IMPORTANTE: Reemplaza con tu URL de API Gateway
const API_URL = 'https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod';

function App() {
  const [gastos, setGastos] = useState([]);
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  // Cargar datos al iniciar
  useEffect(() => {
    cargarTodosDatos();
  }, []);

  // Función para cargar todos los datos
  const cargarTodosDatos = async () => {
    await Promise.all([cargarGastos(), cargarEntrenamientos()]);
  };

  // Función para cargar gastos
  const cargarGastos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/gastos`);

      if (!response.ok) {
        throw new Error('Error al cargar gastos');
      }

      const data = await response.json();
      setGastos(data.gastos || []);

    } catch (error) {
      console.error('Error:', error);
      mostrarToast('Error al cargar los gastos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar entrenamientos
  const cargarEntrenamientos = async () => {
    try {
      const response = await fetch(`${API_URL}/entrenamientos`);

      if (!response.ok) {
        throw new Error('Error al cargar entrenamientos');
      }

      const data = await response.json();
      setEntrenamientos(data.entrenamientos || []);

    } catch (error) {
      console.error('Error:', error);
      mostrarToast('Error al cargar entrenamientos', 'error');
    }
  };

  // Función para crear un nuevo gasto
  const handleGastoCreado = async (nuevoGasto) => {
    try {
      const response = await fetch(`${API_URL}/gastos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoGasto)
      });

      if (!response.ok) {
        throw new Error('Error al crear el gasto');
      }

      await cargarGastos();
      mostrarToast('✅ Gasto añadido correctamente', 'success');

    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al añadir el gasto', 'error');
    }
  };

  // Función para crear un nuevo entrenamiento
  const handleEntrenamientoCreado = async (nuevoEntrenamiento) => {
    try {
      const response = await fetch(`${API_URL}/entrenamientos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoEntrenamiento)
      });

      if (!response.ok) {
        throw new Error('Error al crear el entrenamiento');
      }

      await cargarEntrenamientos();
      mostrarToast('✅ Entrenamiento añadido correctamente', 'success');

    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al añadir el entrenamiento', 'error');
    }
  };
  // Función para eliminar un gasto
  const handleEliminarGasto = async (gastoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/gastos/${gastoId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el gasto');
      }

      await cargarGastos();
      mostrarToast('✅ Gasto eliminado correctamente', 'success');

    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al eliminar el gasto', 'error');
    }
  };

  // Función para actualizar un gasto
  const handleActualizarGasto = async (gastoId, datosActualizados) => {
    try {
      const response = await fetch(`${API_URL}/gastos/${gastoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el gasto');
      }

      await cargarGastos();
      mostrarToast('✅ Gasto actualizado correctamente', 'success');

    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al actualizar el gasto', 'error');
    }
  };

  // Función para eliminar un entrenamiento
  const handleEliminarEntrenamiento = async (entrenamientoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/entrenamientos/${entrenamientoId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el entrenamiento');
      }

      await cargarEntrenamientos();
      mostrarToast('✅ Entrenamiento eliminado correctamente', 'success');

    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al eliminar el entrenamiento', 'error');
    }
  };

  // Función para actualizar un entrenamiento
  const handleActualizarEntrenamiento = async (entrenamientoId, datosActualizados) => {
    try {
      const response = await fetch(`${API_URL}/entrenamientos/${entrenamientoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el entrenamiento');
      }

      await cargarEntrenamientos();
      mostrarToast('✅ Entrenamiento actualizado correctamente', 'success');

    } catch (error) {
      console.error('Error:', error);
      mostrarToast('❌ Error al actualizar el entrenamiento', 'error');
    }
  };

  // Función para mostrar notificaciones
  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo });
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar />

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
          </Routes>
        </main>

        <Toast
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          visible={toast.visible}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      </div>
    </Router>
  );
}

export default App;