const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();
const PORT = 8080;

// Configurar CORS
app.use(cors());
app.use('/archivos', express.static(path.join(__dirname, 'archivos')));
// Definir la carpeta de almacenamiento para los archivos subidos
const folder = path.join(__dirname, '/archivos/');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, folder); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } });

// Middleware para procesar el formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'archivos')));// Ruta para manejar el formulario
app.post('/formulario', upload.single('archivo'), (req, res) => {
    try {
        const { nombre, apellido } = req.body;
        const archivo = req.file ? req.file.filename : null;

        // Crear un PDF
        const timestamp = Date.now(); // Obtener el timestamp actual
        const pdfPath = path.join(__dirname, 'archivos', `${nombre}-${apellido}-${timestamp}.pdf`); // Añadir el timestamp al nombre del archivo
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
            // Enviar respuesta al cliente con la URL del PDF generado
            res.json({
                message: 'Datos recibidos correctamente',
                nombre,
                apellido,
                archivo,
                pdfUrl: `http://localhost:${PORT}/archivos/${nombre}-${apellido}-${timestamp}.pdf` // URL del PDF
            });
        });

        // Enviar respuesta al cliente con la URL del PDF generado
        res.json({
            message: 'Datos recibidos correctamente',
            nombre,
            apellido,
            archivo,
            pdfUrl: `http://localhost:${PORT}/archivos/${nombre}-${apellido}-${timestamp}.pdf` // URL del PDF
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar el formulario' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});