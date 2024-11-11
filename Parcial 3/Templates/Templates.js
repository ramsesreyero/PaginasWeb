const express = require('express');
const path = require('path'); //<=== agregamos modulo path
const app = express();
const pug = require('pug'); //<=== npm install pug

app.use(express.json());//parsea para poder ver los valores abajo
app.use(express.text());

console.log(__dirname); //<====
console.log(__filename);


app.set('view engine', 'pug'); //<===== establecimos control de templates
app.set('views', path.join(__dirname, 'views')); //<===== carpeta views para control de templates


const PORT = 8080;

app.get('/administrativos', (req, res) => {
  console.log(req.query.control)
  //res.send('Servidor Contestando a peticion GET administrativos');
  res.render('admin');
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