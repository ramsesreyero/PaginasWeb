app.post('/formulario', upload.single('archivo'), (req, res) => {
  console.log('Solicitud recibida en /formulario'); // Mensaje de depuración
  try {
    const { nombre, apellido } = req.body;
    const archivo = req.file ? req.file.filename : null;

    // Crear un PDF
    const timestamp = Date.now();
    const pdfName = `${nombre}-${apellido}-${timestamp}.pdf`;
    const pdfPath = path.join(folder, pdfName);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    // Agregar contenido al PDF
    doc.fontSize(25).text(`Nombre: ${nombre}`, 100, 100);
    doc.fontSize(25).text(`Apellido: ${apellido}`, 100, 150);
    if (archivo) {
      doc.fontSize(25).text(`Archivo subido: ${archivo}`, 100, 200);
    }

    doc.end();
    doc.on('finish', () => {
      console.log(`PDF creado: ${pdfPath}`); // Mensaje de depuración
      res.json({
        message: 'Datos recibidos correctamente',
        nombre,
        apellido,
        archivo,
        pdfUrl: `http://localhost:${PORT}/archivos/${pdfName}`
      });
    });
  } catch (error) {
    console.error('Error al procesar el formulario:', error); // Mensaje de error
    res.status(500).json({ message: 'Error al procesar el formulario' });
  }
});