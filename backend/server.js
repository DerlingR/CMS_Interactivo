const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'DerlingM2001',
  database: 'cms_database'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error al verificar usuario en la base de datos:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ message: 'El usuario ya existe' });
    } else {
      connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
        if (err) {
          console.error('Error al registrar usuario en la base de datos:', err);
          res.status(500).json({ message: 'Error interno del servidor' });
          return;
        }
        res.status(200).json({ message: 'Usuario registrado exitosamente' });
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) {
      console.error('Error al verificar credenciales del usuario en la base de datos:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    } else {
      res.status(200).json({ message: 'Inicio de sesión exitoso' });
    }
  });
});

app.post('/api/logout', (req, res) => {
  // Implementar lógica de cierre de sesión si es necesario
  res.status(200).json({ message: 'Cierre de sesión exitoso' });
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
