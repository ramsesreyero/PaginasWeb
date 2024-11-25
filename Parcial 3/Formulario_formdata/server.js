const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

const app = express(); // Inicializa la aplicación Express
const PORT = 8080; // Define el puerto en el que el servidor escuchará

// Configuración de CORS
app.use(cors());

// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'archivos'); // Asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Middleware para validar los campos
const validateForm = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
];

// Ruta para manejar el formulario
app.post('/formulario', upload.single('archivo'), validateForm, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
 return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, apellido } = req.body;
    const archivo = req.file ? req.file.filename : null;

    // Crear un PDF
    const timestamp = Date.now();
    const pdfName = `${nombre}-${apellido}-${timestamp}.pdf`;
    const pdfPath = path.join('archivos', pdfName); // Asegúrate de que esta carpeta exista
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
});

// Servir archivos estáticos
app.use('/archivos', express.static(path.join(__dirname, 'archivos')));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});