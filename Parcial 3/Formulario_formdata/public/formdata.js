document.getElementById('pdfForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío normal del formulario

    const formData = new FormData(this);

    fetch('http://localhost:8080/formulario', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Respuesta del servidor: ' + JSON.stringify(data));
    })
    .catch(error => {
        console.error('Error:', error);
    });
});