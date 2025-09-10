/**
 * Clase principal que procesa los archivos generados y crea reportes.
 * Reporte 1: Total recaudado por vendedor (ordenado de mayor a menor).
 * Reporte 2: Total de productos vendidos (ordenado de mayor a menor).
 */

const fs = require("fs");
const path = require("path");

const carpetaDatos = path.join(__dirname, "datos");

// Función auxiliar: lee archivo y retorna líneas
function leerArchivo(ruta) {
  return fs.readFileSync(ruta, "utf-8").trim().split("\n");
}

/**
 * Procesa la información de vendedores y ventas.
 */
function procesarVentas() {
  // Leer archivos base
  const vendedores = leerArchivo(path.join(carpetaDatos, "vendedores.txt"));
  const productos = leerArchivo(path.join(carpetaDatos, "productos.txt"));

  // Diccionario de productos: id -> {nombre, precio, cantidadVendida}
  const mapaProductos = {};
  for (let linea of productos) {
    const [id, nombre, precio] = linea.split(";");
    mapaProductos[id] = { nombre, precio: Number(precio), cantidadVendida: 0 };
  }

  // Diccionario de vendedores: doc -> {nombreCompleto, totalVendido}
  const mapaVendedores = {};
  for (let linea of vendedores) {
    const [tipoDoc, numDoc, nombre, apellido] = linea.split(";");
    mapaVendedores[numDoc] = { 
      nombreCompleto: `${nombre} ${apellido}`, 
      totalVendido: 0 
    };
  }

  // Procesar cada archivo de ventas
  const archivosVentas = fs.readdirSync(carpetaDatos).filter(f => f.startsWith("ventas_"));

  for (let archivo of archivosVentas) {
    const lineas = leerArchivo(path.join(carpetaDatos, archivo));
    const [, numDoc] = lineas[0].split(";"); // primera línea = vendedor

    for (let i = 1; i < lineas.length; i++) {
      const [idProducto, cantidad] = lineas[i].split(";");
      if (mapaProductos[idProducto]) {
        const venta = mapaProductos[idProducto].precio * Number(cantidad);
        mapaVendedores[numDoc].totalVendido += venta;
        mapaProductos[idProducto].cantidadVendida += Number(cantidad);
      }
    }
  }

  // Generar reporte de vendedores
  const reporteVendedores = Object.values(mapaVendedores)
    .sort((a, b) => b.totalVendido - a.totalVendido)
    .map(v => `${v.nombreCompleto};${v.totalVendido}`)
    .join("\n");

  fs.writeFileSync(path.join(carpetaDatos, "reporte_vendedores.csv"), reporteVendedores);

  // Generar reporte de productos
  const reporteProductos = Object.values(mapaProductos)
    .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
    .map(p => `${p.nombre};${p.precio};${p.cantidadVendida}`)
    .join("\n");

  fs.writeFileSync(path.join(carpetaDatos, "reporte_productos.csv"), reporteProductos);

  console.log("🎉 Reportes generados correctamente");
}

// MAIN
(function main() {
  try {
    procesarVentas();
  } catch (error) {
    console.error("❌ Error procesando archivos:", error);
  }
})();