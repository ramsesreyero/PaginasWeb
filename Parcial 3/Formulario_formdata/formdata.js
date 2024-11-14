const express = require('express');
const multer = require('multer'); 
const path = require('path');
const app = express();

const PORT = 8080;

// Definir una ruta para almacenar archivos que se envían del cliente
const folder = path.join(__dirname, '/archivos/'); 
const upload = multer({ dest: folder });             

// Middleware para procesar el formulario
app.use(express.json()); // Para procesar JSON
app.use(express.urlencoded({ extended: true })); // Para procesar datos de formularios

// Ruta para manejar el formulario
app.post('/formulario', upload.single('archivo'), (req, res) => {
    if (req.file) {
        console.log(`Se recibió el archivo: ${req.file.originalname}`);
    } else {
        console.log('No se recibió ningún archivo.');
    }

    console.log('Datos del formulario:', req.body); 
    console.log('Se recibió el formulario:', JSON.stringify(req.body)); 

    res.json({
        message: 'Formulario recibido',
        data: req.body,
        file: req.file ? req.file.originalname : 'No se subió archivo'
    }); 
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});