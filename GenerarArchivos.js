/**
 * Clase principal para generar archivos pseudoaleatorios de prueba.
 * Aquí se crean vendedores, productos y archivos de ventas.
 * 
 * Autor: Tu Nombre
 */

const fs = require("fs");
const path = require("path");

// Carpeta donde se almacenan los archivos de datos
const carpetaDatos = path.join(__dirname, "datos");

// Listas base de nombres y apellidos
const nombres = ["Carlos", "María", "Andrés", "Sofía", "Laura", "Jorge"];
const apellidos = ["Pérez", "Gómez", "Rodríguez", "Martínez", "Hernández", "López"];

// Función auxiliar: número aleatorio entero
function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Crea archivo con información de vendedores.
 */
function crearArchivoVendedores(cantidad) {
  let contenido = "";
  for (let i = 0; i < cantidad; i++) {
    const tipoDocumento = "CC";
    const numeroDocumento = 1000 + i;
    const nombre = nombres[numeroAleatorio(0, nombres.length - 1)];
    const apellido = apellidos[numeroAleatorio(0, apellidos.length - 1)];

    contenido += `${tipoDocumento};${numeroDocumento};${nombre};${apellido}\n`;
  }

  fs.writeFileSync(path.join(carpetaDatos, "vendedores.txt"), contenido);
  console.log("✅ Archivo vendedores.txt generado");
}

/**
 * Crea archivo con información de productos.
 */
function crearArchivoProductos(cantidad) {
  let contenido = "";
  for (let i = 1; i <= cantidad; i++) {
    const idProducto = i;
    const nombreProducto = `Producto${i}`;
    const precio = numeroAleatorio(1000, 10000);

    contenido += `${idProducto};${nombreProducto};${precio}\n`;
  }

  fs.writeFileSync(path.join(carpetaDatos, "productos.txt"), contenido);
  console.log("✅ Archivo productos.txt generado");
}

/**
 * Crea archivo con ventas de un vendedor específico.
 */
function crearArchivoVentas(idVendedor, cantidadProductos, productosTotales) {
  let contenido = "";
  const tipoDocumento = "CC";
  const numeroDocumento = 1000 + idVendedor;

  // Primera línea: identificación del vendedor
  contenido += `${tipoDocumento};${numeroDocumento}\n`;

  // Agregar productos vendidos
  for (let i = 0; i < cantidadProductos; i++) {
    const idProducto = numeroAleatorio(1, productosTotales);
    const cantidadVendida = numeroAleatorio(1, 10);

    contenido += `${idProducto};${cantidadVendida};\n`;
  }

  fs.writeFileSync(path.join(carpetaDatos, `ventas_${idVendedor}.txt`), contenido);
  console.log(`✅ Archivo ventas_${idVendedor}.txt generado`);
}

// MAIN de este archivo
(function main() {
  try {
    if (!fs.existsSync(carpetaDatos)) fs.mkdirSync(carpetaDatos);

    crearArchivoVendedores(5);      // Genera 5 vendedores
    crearArchivoProductos(10);      // Genera 10 productos
    for (let i = 0; i < 5; i++) {
      crearArchivoVentas(i, numeroAleatorio(3, 7), 10);
    }

    console.log("🎉 Archivos de prueba generados correctamente");
  } catch (error) {
    console.error("❌ Error generando archivos:", error);
  }
})();