const express = require('express');
const multer = require('multer'); 
const cors = require('cors'); 
const path = require('path');
const PDFDocument = require('pdfkit'); // Importar pdfkit
const app = express();

const PORT = 8080;

// Definir una ruta para almacenar archivos que se envían del cliente
const folder = path.join(__dirname, '/archivos/'); 

// Configurar multer para usar almacenamiento personalizado
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, folder); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Usar el nombre original del archivo
    }
});

const upload = multer({ storage: storage });             

// Middleware para procesar el formulario
app.use(express.json()); // Para procesar JSON
app.use(express.urlencoded({ extended: true })); // Para procesar datos de formularios
app.use(cors());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar el formulario
app.post('/formulario', upload.single('archivo'), (req, res) => {
    const { titulo, contenido } = req.body;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Enviar el PDF como respuesta
    res.setHeader('Content-type', 'application/pdf');

    // Agregar contenido al PDF
    doc.text(titulo, { align: 'center' });
    doc.moveDown();
    doc.text(contenido);

    // Finalizar el PDF y enviar la respuesta
    doc.pipe(res);
    doc.end();
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});