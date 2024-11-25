// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Para servir archivos estáticos

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para generar PDF
app.post('/generate-pdf', 
    upload.single('file'), 
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .matches(/^[A-Za-z]+$/).withMessage('El nombre solo puede contener letras'),
    body('surname')
        .notEmpty().withMessage('El apellido es obligatorio')
        .matches(/^[A-Za-z]+$/).withMessage('El apellido solo puede contener letras'),
    async (req, res) => {
        // Validar entradas
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, surname } = req.body;

        // Crear PDF
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([600, 400]);
            page.drawText(`Nombre: ${name}`, { x: 50, y: 350 });
            page.drawText(`Apellido: ${surname}`, { x: 50, y: 320 });

            const pdfBytes = await pdfDoc.save();

            // Guardar el PDF en el sistema de archivos
            const filePath = path.join(__dirname, 'generated.pdf');
            fs.writeFileSync(filePath, pdfBytes);

            // Redirigir al navegador para abrir el PDF
            res.redirect('/generated.pdf');
        } catch (error) {
            console.error('Error al generar el PDF:', error.message);
            return res.status(500).send('Error al generar el PDF');
        }
    }
);

// Servir el formulario HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Servir el PDF generado
app.get('/generated.pdf', (req, res) => {
    const filePath = path.join(__dirname, 'generated.pdf');
    res.sendFile(filePath);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});