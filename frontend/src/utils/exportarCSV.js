// Función para convertir datos a CSV
export const exportarGastosCSV = (gastos) => {
  if (gastos.length === 0) {
    alert('No hay gastos para exportar');
    return;
  }

  // Encabezados del CSV
  const headers = ['Fecha', 'Categoría', 'Descripción', 'Cantidad (€)'];
  
  // Convertir datos a filas
  const rows = gastos.map(gasto => [
    gasto.fecha,
    gasto.categoria,
    gasto.descripcion || 'Sin descripción',
    parseFloat(gasto.cantidad).toFixed(2)
  ]);

  // Crear contenido CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Crear y descargar archivo
  descargarCSV(csvContent, 'gastos.csv');
};

export const exportarEntrenamientosCSV = (entrenamientos) => {
  if (entrenamientos.length === 0) {
    alert('No hay entrenamientos para exportar');
    return;
  }

  // Encabezados
  const headers = ['Fecha', 'Tipo', 'Duración (min)', 'Ejercicios'];
  
  // Filas
  const rows = entrenamientos.map(e => [
    e.fecha,
    e.tipo,
    e.duracion,
    e.ejercicios
  ]);

  // Crear CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  descargarCSV(csvContent, 'entrenamientos.csv');
};

// Función auxiliar para descargar el archivo
const descargarCSV = (contenido, nombreArchivo) => {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};