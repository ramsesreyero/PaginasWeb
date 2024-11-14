const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
const PORT = 8080;

app.post('/formulario', (req, res) => {
  const { nombre } = req.body;
  console.log(req.query.control);
  res.send(`Hola ${nombre}`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});