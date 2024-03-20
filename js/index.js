document.getElementById('formulario').addEventListener('submit', function (e) {
	e.preventDefault();

	let user = document.getElementById('user').value;
	let pass = document.getElementById('pass').value;

	//verificar las credenciales

	if (user === 'usuario' && pass === 'contraseña') {
		localStorage.setItem('logCorrecto', true);

		//redirigir a galeria de venta
		window.location.href = 'gallery.html';
	} else {
		document.getElementById('alert').innerText = 'No son correctos los datos ingresados.';
	}
});

window.addEventListener('load', function () {
	if (localStorage.getItem('logCorrecto')) {
		window.location.href = 'gallery.html';
	}
});
