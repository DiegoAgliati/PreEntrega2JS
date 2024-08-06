let set_id = 1;
class Producto {
    constructor(nombre, precio, imagen, stock){
        this.nombre = nombre;
        this.id = set_id++;
        this.precio = precio;
        this.stock = stock || Math.ceil(Math.random() * (30 - 10) + 10);
        this.imagen = imagen;
    }
}

let productos = [
    new Producto('arroz', 2500, 'img/arroz.png'),
    new Producto('fideos', 1500, 'img/fideos.png'),
    new Producto('pan', 2000, 'img/pan.png'),
    new Producto('huevos', 2500, 'img/huevos.png'),
    new Producto('leche', 2000, 'img/leche.png'),
    new Producto('azucar', 3000, 'img/azucar.png'),
    new Producto('sal', 1500, 'img/sal.png'),
    new Producto('harina', 3000, 'img/harina.png'),
    new Producto('avena', 1500, 'img/avena.png',),
    new Producto('maiz', 750, 'img/maiz.png'),
    new Producto('arvejas', 700, 'img/arvejas.png'),
    new Producto('aceite', 2500, 'img/aceite.png'),
    new Producto('yogurt', 2000, 'img/yogurt.png'),
    new Producto('queso', 3000, 'img/queso.png'),
    new Producto('cafe', 3000, 'img/cafe.png'),
];

class Carrito {
    constructor() {
        const carritoGuardado = localStorage.getItem('carrito');
        this.productos = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    agregarProducto(producto, cantidad) {
        const productoEnCarrito = this.productos.find(p => p.producto.id === producto.id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            this.productos.push({ producto, cantidad });
        }
        this.guardarCarrito();
    }

    eliminarProducto(idProducto) {
        const productoEnCarrito = this.productos.find(p => p.producto.id === idProducto);
        if (productoEnCarrito) {
            // Aumentar el stock del producto en el inventario
            const producto = productos.find(p => p.id === idProducto);
            if (producto) {
                producto.stock += productoEnCarrito.cantidad;
            }
        }
        this.productos = this.productos.filter(p => p.producto.id !== idProducto);
        this.guardarCarrito();
    }

    verCarrito() {
        return this.productos.map(p => ({
            nombre: p.producto.nombre,
            cantidad: p.cantidad,
            precio: p.producto.precio,
            subtotal: p.cantidad * p.producto.precio,
            producto: p.producto
        }));
    }

    calcularTotal() {
        return this.productos.reduce((total, p) => total + (p.cantidad * p.producto.precio), 0);
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.productos));
    }
}

let carrito = new Carrito();

function mostrarProductosDisponibles() {
    const productosLista = document.getElementById('productos-lista');
    if (!productosLista) {
        console.error("El elemento 'productos-lista' no se encontró en el DOM");
        return;
    }
    productosLista.innerHTML = '';
    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.className = 'producto';
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        productosLista.appendChild(productoElement);
    });
}

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (producto && producto.stock > 0) {
        carrito.agregarProducto(producto, 1);
        producto.stock--;
        actualizarCarrito();
        mostrarProductosDisponibles();  
    } else {
        alert('No hay suficiente stock disponible.');
    }
}

function actualizarCarrito() {
    const carritoLista = document.getElementById('carrito-lista');
    if (!carritoLista) {
        console.error("El elemento 'carrito-lista' no se encontró en el DOM");
        return;
    }
    carritoLista.innerHTML = '';
    carrito.verCarrito().forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrito-item';
        itemElement.innerHTML = `
            <img src="${item.producto.imagen}" alt="${item.nombre}" class="carrito-imagen">
            <h3>${item.nombre}</h3>
            <p>Cantidad: ${item.cantidad}</p>
            <p>Subtotal: $${item.subtotal}</p>
            <button onclick="eliminarDelCarrito(${item.producto.id})">Eliminar</button>
        `;
        carritoLista.appendChild(itemElement);
    });
    const totalElement = document.getElementById('total-amount');
    if (totalElement) {
        totalElement.textContent = carrito.calcularTotal();
    } else {
        console.error("El elemento 'total-amount' no se encontró en el DOM");
    }
}

function eliminarDelCarrito(idProducto) {
    carrito.eliminarProducto(idProducto);
    actualizarCarrito();
    mostrarProductosDisponibles();
}

// Inicializar la página
console.log("Inicializando la página");
console.log("Número de productos:", productos.length);
mostrarProductosDisponibles();
actualizarCarrito();
