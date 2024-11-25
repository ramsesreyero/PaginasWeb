document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('pdfForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Evita el envío normal del formulario

      const formData = new FormData(this);

      fetch('http://localhost:8080/formulario', {
          method: 'POST',
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          console.log('URL del PDF:', data.pdfUrl); // Imprimir la URL en la consola
          alert('Respuesta del servidor: ' + JSON.stringify(data));

          // Abrir el PDF en una nueva pestaña
          const pdfUrl = data.pdfUrl;
          window.open(pdfUrl, '_blank'); // Esto abrirá el PDF en una nueva pestaña
      })
      .catch(error => {
          console.error('Error:', error);
      });
  });
});