//carrito de compras
let elementosCarrito = [];
let productos = [];

const contenedorProductos = document.getElementById('grid');
const contenedorElementosCarrito = document.getElementById('carrito');
const totalSpan = document.getElementById('total');

async function obtenerProductos() {
	try {
		const response = await fetch('./productos.json');
		if (!response.ok) {
			throw new Error('No se pudo cargar el archivo de productos.');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error al cargar los productos:', error);
		return [];
	}
}

async function renderizarProductos() {
	try {
		// Obtiene los productos usando la función obtenerProductos
		productos = await obtenerProductos();
		// Limpia el contenedor de productos antes de renderizar los nuevos productos
		contenedorProductos.innerHTML = '';
		// Renderiza los productos obtenidos
		productos.forEach((producto) => {
			const card = document.createElement('div');
			card.classList.add('card');
			card.innerHTML = `
							<img src="./img/${producto.img}">
							<h3>${producto.nombre}</h3>
							<p>CLP $${producto.precio}</p>
							<button class="btn-agregar-carrito" data-id="${producto.codigo}">Agregar</button>`;
			contenedorProductos.appendChild(card);
		});
	} catch (error) {
		console.error('Error al renderizar los productos:', error);
	}
}

// Llama a la función para renderizar los productos
renderizarProductos();

//agregar al carrito el producto

function agregarAlCarrito(idProducto) {
	const itemExistente = elementosCarrito.find((item) => item.codigo === idProducto);
	if (itemExistente) {
		itemExistente.cantidad++;
	} else {
		const producto = productos.find((p) => p.codigo === idProducto);
		if (producto) {
			elementosCarrito.push({ ...producto, cantidad: 1 });
			renderizarCarrito();
		}
	}
	// Guardar el carrito actualizado en el localStorage
	localStorage.setItem('carrito', JSON.stringify(elementosCarrito));
	renderizarCarrito();
}

//eliminar el producto

function eliminarDelCarrito(idProducto) {
	const indice = elementosCarrito.findIndex((item) => item.codigo === idProducto);
	if (indice !== -1) {
		elementosCarrito.splice(indice, 1);

		// Guardar el carrito actualizado en el localStorage
		localStorage.setItem('carrito', JSON.stringify(elementosCarrito));
		renderizarCarrito();
	}
}

function renderizarCarrito() {
	contenedorElementosCarrito.innerHTML = '';
	let precioTotal = 0;
	elementosCarrito.forEach((item) => {
		const div = document.createElement('div');

		div.innerHTML = `<p>${item.nombre} x ${item.cantidad}  - $${item.precio * item.cantidad}</p>`;

		const btnEliminar = document.createElement('button');
		btnEliminar.textContent = 'x';
		btnEliminar.addEventListener('click', () => eliminarDelCarrito(item.codigo));
		div.appendChild(btnEliminar);
		contenedorElementosCarrito.appendChild(div);

		precioTotal += item.precio * item.cantidad;
	});

	const precioNeto = precioTotal / 1.19;
	const precioIVA = precioTotal - precioNeto;

	totalSpan.innerHTML = `
    <span>Precio Neto: $${precioNeto.toFixed(0)}</span>
    <span>IVA (19%): $${precioIVA.toFixed(0)}</span>
    <span class="bold">Precio Total: $${precioTotal.toFixed(0)}</span>
  `;
}
function realizarCompra() {
	const precioTotal = elementosCarrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
	// const precioNeto = precioTotal / 1.19;
	// const precioIVA = precioTotal - precioNeto;

	// alert(`Compra finalizada\nTotal: $${precioTotal.toFixed(0)}`);
	Toastify({
		text: `Compra finalizada\nTotal: $${precioTotal.toFixed(0)}`,
		duration: 5000, // Duración de la notificación en milisegundos (opcional)
		gravity: 'top', // Posición de la notificación (opcional)
		position: 'center', // Posición de la notificación (opcional)
		backgroundColor: 'linear-gradient(to right, brown, #2e1414)', // Color de fondo (opcional)
		stopOnFocus: true, // Detener la notificación al hacer clic en ella (opcional)
	}).showToast();

	elementosCarrito.length = 0;
	renderizarCarrito();
}

document.getElementById('btn-comprar').addEventListener('click', realizarCompra);

contenedorProductos.addEventListener('click', function (evento) {
	if (evento.target.classList.contains('btn-agregar-carrito')) {
		const idProducto = parseInt(evento.target.getAttribute('data-id'));
		agregarAlCarrito(idProducto);
	}
});

renderizarProductos();

// Función para cargar el carrito desde el localStorage al cargar la página
function cargarCarritoDesdeLocalStorage() {
	const carritoGuardado = localStorage.getItem('carrito');
	if (carritoGuardado) {
		elementosCarrito = JSON.parse(carritoGuardado);
		renderizarCarrito();
	}
}

// Llama a la función para cargar el carrito desde el localStorage al cargar la página
cargarCarritoDesdeLocalStorage();
