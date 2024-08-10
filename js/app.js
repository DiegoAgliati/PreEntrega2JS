let set_id = 1;
class Producto {
    constructor(nombre, precio, imagen, stock) {
        this.nombre = nombre;
        this.id = set_id++;
        this.precio = precio;
        this.stock = stock || Math.ceil(Math.random() * 20 + 10);
        this.imagen = imagen;
    }
}

const productos = [
    'arroz', 'fideos', 'pan', 'huevos', 'leche', 'azucar', 'sal', 'harina', 'avena', 'maiz', 'arvejas', 'aceite', 'yogurt', 'queso', 'cafe'
].map((nombre, index) => new Producto(nombre, [2500, 1500, 2000, 2500, 2000, 3000, 1500, 3000, 1500, 750, 700, 2500, 2000, 3000, 3000][index], `img/${nombre}.png`));

class Carrito {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem('carrito') || '[]');
    }

    agregarProducto(producto, cantidad) {
        const item = this.productos.find(p => p.producto.id === producto.id);
        item ? item.cantidad += cantidad : this.productos.push({ producto, cantidad });
        this.guardarCarrito();
    }

    eliminarProducto(idProducto) {
        const item = this.productos.find(p => p.producto.id === idProducto);
        if (item) productos.find(p => p.id === idProducto).stock += item.cantidad;
        this.productos = this.productos.filter(p => p.producto.id !== idProducto);
        this.guardarCarrito();
    }

    verCarrito() {
        return this.productos.map(({ producto, cantidad }) => ({
            ...producto,
            cantidad,
            subtotal: cantidad * producto.precio
        }));
    }

    calcularTotal() {
        return this.productos.reduce((total, p) => total + p.cantidad * p.producto.precio, 0);
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.productos));
    }
    actualizarCantidad(idProducto, nuevaCantidad) {
        const item = this.productos.find(p => p.producto.id === idProducto);
        if (item) {
            const diferencia = nuevaCantidad - item.cantidad;
            const producto = productos.find(p => p.id === idProducto);
            if (producto.stock >= diferencia || diferencia < 0) {
                item.cantidad = nuevaCantidad;
                producto.stock -= diferencia;
                if (item.cantidad <= 0) {
                    this.eliminarProducto(idProducto);
                }
                this.guardarCarrito();
                return true;
            }
        }
        return false;
    }

    vaciarCarrito() {
        this.productos.forEach(item => {
            const producto = productos.find(p => p.id === item.producto.id);
            if (producto) {
                producto.stock += item.cantidad;
            }
        });
        this.productos = [];
        this.guardarCarrito();
    }
}


const carrito = new Carrito();

function actualizarDOM(id, callback) {
    const element = document.getElementById(id);
    if (element) callback(element);
    else console.error(`El elemento '${id}' no se encontró en el DOM`);
}

function mostrarProductosDisponibles() {
    actualizarDOM('productos-lista', productosLista => {
        productosLista.innerHTML = productos.map(producto => `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Stock: ${producto.stock}</p>
                <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
        `).join('');
    });
}

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (producto?.stock > 0) {
        carrito.agregarProducto(producto, 1);
        producto.stock--;
        actualizarCarrito();
        mostrarProductosDisponibles();
    } else {
        alert('No hay suficiente stock disponible.');
    }
}

function mostrarCarritoFlotante() {
    const carritoHTML = carrito.verCarrito().map(item => `
        <div class="carrito-item">
            <img src="${item.imagen}" alt="${item.nombre}" class="carrito-imagen" style="width: 50px; height: 50px;">
            <h3>${item.nombre}</h3>
            <div class="cantidad-control">
                <button onclick="actualizarCantidadEnCarrito(${item.id}, ${item.cantidad - 1})">-</button>
                <span>${item.cantidad}</span>
                <button onclick="actualizarCantidadEnCarrito(${item.id}, ${item.cantidad + 1})">+</button>
            </div>
            <p>Subtotal: $${item.subtotal}</p>
            <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        </div>
    `).join('');

    Swal.fire({
        title: 'Carrito de Compras',
        html: `
            <div id="carrito-lista">${carritoHTML}</div>
            <div id="carrito-total">Total: $${carrito.calcularTotal()}</div>
            <button id="vaciar-carrito" class="vaciar-carrito-btn">Vaciar Carrito</button>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        width: '600px',
        customClass: {
            container: 'carrito-flotante-container',
            popup: 'carrito-flotante-popup',
            header: 'carrito-flotante-header',
            closeButton: 'carrito-flotante-close',
        },
        didOpen: () => {
            document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
        }
    });
}

function actualizarCantidadEnCarrito(idProducto, nuevaCantidad) {
    if (carrito.actualizarCantidad(idProducto, nuevaCantidad)) {
        actualizarCarrito();
        mostrarProductosDisponibles();
        mostrarCarritoFlotante();
    } else {
        Swal.fire('Error', 'No hay suficiente stock disponible', 'error');
    }
}

function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminaran todos los productos del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.vaciarCarrito();
            actualizarCarrito();
            mostrarProductosDisponibles();
            mostrarCarritoFlotante();
            Swal.fire(
                'Carrito vaciado',
                'Se han eliminado todos los productos del carrito',
                'success'
            );
        }
    });
}
function actualizarCarrito() {
    const cantidadTotal = carrito.productos.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById('abrir-carrito').textContent = `Ver Carrito (${cantidadTotal})`;
}

function eliminarDelCarrito(idProducto) {
    carrito.eliminarProducto(idProducto);
    actualizarCarrito();
    mostrarProductosDisponibles();
    mostrarCarritoFlotante();
}

document.getElementById('abrir-carrito').addEventListener('click', mostrarCarritoFlotante);

console.log("Inicializando la página");
console.log("Número de productos:", productos.length);
mostrarProductosDisponibles();
actualizarCarrito();