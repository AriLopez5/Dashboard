// IMPORTANTE: Reemplaza esta URL con la de tu API Gateway
const API_URL = 'https://TU-API-ID.execute-api.eu-north-1.amazonaws.com/prod';

// Estado de la aplicación
let todosLosGastos = [];
let gastosFiltrados = [];

// Elementos del DOM
const formGasto = document.getElementById('formGasto');
const listaGastos = document.getElementById('listaGastos');
const totalAmount = document.getElementById('totalAmount');
const totalCount = document.getElementById('totalCount');
const filtroCategoria = document.getElementById('filtroCategoria');
const loading = document.getElementById('loading');
const emptyMessage = document.getElementById('emptyMessage');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Establecer fecha actual por defecto
    document.getElementById('fecha').valueAsDate = new Date();
    
    // Cargar gastos
    cargarGastos();
    
    // Event listeners
    formGasto.addEventListener('submit', handleSubmitGasto);
    filtroCategoria.addEventListener('change', handleFiltroCategoria);
});

// === FUNCIONES PRINCIPALES ===

// Cargar gastos desde la API
async function cargarGastos() {
    try {
        mostrarLoading(true);
        
        const response = await fetch(`${API_URL}/gastos`);
        
        if (!response.ok) {
            throw new Error('Error al cargar gastos');
        }
        
        const data = await response.json();
        todosLosGastos = data.gastos || [];
        gastosFiltrados = todosLosGastos;
        
        mostrarLoading(false);
        renderizarGastos();
        actualizarTotales();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarLoading(false);
        mostrarToast('Error al cargar los gastos', 'error');
    }
}

// Manejar envío del formulario
async function handleSubmitGasto(e) {
    e.preventDefault();
    
    const nuevoGasto = {
        cantidad: parseFloat(document.getElementById('cantidad').value),
        categoria: document.getElementById('categoria').value,
        descripcion: document.getElementById('descripcion').value || '',
        fecha: document.getElementById('fecha').value
    };
    
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
        
        // Limpiar formulario
        formGasto.reset();
        document.getElementById('fecha').valueAsDate = new Date();
        
        // Recargar gastos
        await cargarGastos();
        
        mostrarToast('✅ Gasto añadido correctamente', 'success');
        
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('❌ Error al añadir el gasto', 'error');
    }
}

// Manejar filtro por categoría
function handleFiltroCategoria(e) {
    const categoriaSeleccionada = e.target.value;
    
    if (categoriaSeleccionada === '') {
        gastosFiltrados = todosLosGastos;
    } else {
        gastosFiltrados = todosLosGastos.filter(
            gasto => gasto.categoria === categoriaSeleccionada
        );
    }
    
    renderizarGastos();
    actualizarTotales();
}

// === FUNCIONES DE RENDERIZADO ===

// Renderizar la lista de gastos
function renderizarGastos() {
    if (gastosFiltrados.length === 0) {
        emptyMessage.style.display = 'block';
        listaGastos.innerHTML = '';
        return;
    }
    
    emptyMessage.style.display = 'none';
    
    const html = gastosFiltrados.map(gasto => `
        <div class="gasto-item ${gasto.categoria}">
            <div class="gasto-info">
                <div class="gasto-categoria">${obtenerEmojiCategoria(gasto.categoria)} ${gasto.categoria}</div>
                <div class="gasto-descripcion">${gasto.descripcion || 'Sin descripción'}</div>
                <div class="gasto-fecha">${formatearFecha(gasto.fecha)}</div>
            </div>
            <div class="gasto-cantidad">${gasto.cantidad.toFixed(2)} €</div>
        </div>
    `).join('');
    
    listaGastos.innerHTML = html;
}

// Actualizar totales
function actualizarTotales() {
    const total = gastosFiltrados.reduce((sum, gasto) => sum + parseFloat(gasto.cantidad), 0);
    const count = gastosFiltrados.length;
    
    totalAmount.textContent = `${total.toFixed(2)} €`;
    totalCount.textContent = `${count} gasto${count !== 1 ? 's' : ''} registrado${count !== 1 ? 's' : ''}`;
}

// === FUNCIONES AUXILIARES ===

// Mostrar/ocultar loading
function mostrarLoading(mostrar) {
    loading.style.display = mostrar ? 'block' : 'none';
}

// Mostrar notificación toast
function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast ${tipo} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Obtener emoji según categoría
function obtenerEmojiCategoria(categoria) {
    const emojis = {
        'alimentacion': '🍔',
        'transporte': '🚗',
        'ocio': '🎮',
        'deporte': '💪',
        'salud': '🏥',
        'otros': '📦'
    };
    return emojis[categoria] || '📦';
}

// Formatear fecha
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}