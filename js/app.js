let set_id = 1;
class Producto {
    constructor(nombre, precio, stock){
        this.nombre = nombre;
        this.id = set_id++;
        this.precio = precio;
        this.stock = Math.ceil(Math.random()* (30-10) + 10);
    }
}

let productos = [
    new Producto('arroz', 2500),
    new Producto('fideos', 1500),
    new Producto('pan', 2000),
    new Producto('huevos', 2500),
    new Producto('leche', 2000),
    new Producto('azucar', 3000),
    new Producto('sal', 1500),
    new Producto('harina', 3000),
    new Producto('avena', 1500, 56),
    new Producto('maiz', 750),
    new Producto('arvejas', 700),
    new Producto('aceite', 2500),
    new Producto('yogurt', 2000),
    new Producto('queso', 3000),
    new Producto('cafe', 3000),
];

class Carrito {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto, cantidad) {
        const productoEnCarrito = this.productos.find(p => p.producto.id === producto.id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            this.productos.push({ producto, cantidad });
        }
    }

    eliminarProducto(idProducto) {
        this.productos = this.productos.filter(p => p.producto.id !== idProducto);
    }

    verCarrito() {
        return this.productos.map(p => ({
            nombre: p.producto.nombre,
            cantidad: p.cantidad,
            precio: p.producto.precio,
            subtotal: p.cantidad * p.producto.precio
        }));
    }

    calcularTotal() {
        return this.productos.reduce((total, p) => total + (p.cantidad * p.producto.precio), 0);
    }
}

let carrito = new Carrito();

function mostrarProductosDisponibles() {
    let listaProductos = productos.map(p => `${p.id}. ${p.nombre} - Precio: $${p.precio}`).join('\n');
    alert(`Productos disponibles:\n${listaProductos}`);
}

function agregarProductosAlCarrito() {
    let continuar = true;
    while (continuar) {
        mostrarProductosDisponibles();
        let seleccion = prompt("Ingrese el nombre del producto que desea agregar (o escriba 'fin' para terminar):");
        if (seleccion === null || seleccion.toLowerCase() === 'fin') {
            continuar = false;
            break;
        }

        let producto = productos.find(p => p.nombre.toLowerCase() === seleccion.toLowerCase());
        if (producto) {
            let cantidadStr = prompt(`Ingrese la cantidad de ${producto.nombre} que desea agregar:`);
            let cantidad = parseInt(cantidadStr);
            if (!isNaN(cantidad) && cantidad > 0) {
                carrito.agregarProducto(producto, cantidad);
                alert(`${cantidad} unidades de ${producto.nombre} agregadas al carrito.`);
            } else {
                alert("Cantidad no válida. Intente nuevamente.");
            }
        } else {
            alert("Producto no encontrado. Intente nuevamente.");
        }
    }
}

function mostrarCarrito() {
    let contenidoCarrito = carrito.verCarrito().map(item => `${item.nombre} - Cantidad: ${item.cantidad} - Subtotal: $${item.subtotal}`).join('\n');
    let total = carrito.calcularTotal();
    alert(`Contenido del Carrito:\n${contenidoCarrito}\n\nTotal: $${total}`);
}

agregarProductosAlCarrito();
mostrarCarrito();
