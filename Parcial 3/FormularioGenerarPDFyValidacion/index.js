// index.js
async function handleSubmit(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    const formData = new FormData(event.target);

    try {
        const response = await fetch('/generate-pdf', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert('Errores de validación:\n' + errorData.errors.map(err => err.msg).join('\n'));
        } else {
            window.location.href = '/generated.pdf'; // Redirige al PDF generado
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    }
}