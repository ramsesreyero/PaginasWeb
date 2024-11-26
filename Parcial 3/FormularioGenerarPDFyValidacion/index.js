async function handleSubmit(event) {
    event.preventDefault();
  
    const formData = new FormData(event.target);
  
    try {
      const response = await fetch('/generate-pdf', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      } else {
        window.location.href = '/generated.pdf';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    }
  }