const express = require('express');
const app = express();

app.use(express.json());//parsea para poder ver los valores abajo
app.use(express.text());


const PORT = 8080;

app.get('/administrativos', (req, res) => {
  console.log(req.query.control)
  res.send('Servidor Contestando a peticion GET administrativos');
});

app.get('/maestros', (req, res) => {
  console.log(req.body.control)
  res.send('Servidor Contestando a peticion GET maestros');
});

app.get('/estudiantes/:carrera', (req, res) => {
  console.log(req.params.carrera);
  console.log(req.query.control);

  res.send('Servidor Contestando a peticion GET estudiantes');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});