require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((e) => console.error("Error conectando a MongoDB Atlas:", e));

// Ruta de registro
app.post('/registero', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);

        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            nombre: req.body.name
        });

        await newUser.save();
        res.status(201).send('Usuario registrado con éxito');
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).send('El email ya está registrado.');
        } else {
            console.error(error);
            res.status(500).send(error.message);
        }
    }
});


// Ruta de login
app.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).send('Usuario no encontrado.');
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(401).send('Contraseña incorrecta.');
      }
  
      // Generar un token JWT para el usuario
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      const userData = {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
      };
      res.status(200).send({ token, user: userData });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  });

  app.post('/registrarUbicacion', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuarioId = decoded.userId;

        const { latitud, longitud, timestamp } = req.body;
        const ubicacion = { latitude: latitud, longitude: longitud, timestamp };
        
        await User.findByIdAndUpdate(usuarioId, { $push: { locationHistory: ubicacion } });
        res.send('Ubicación registrada con éxito');
    } catch (error) {
        console.error('Error registrando la ubicación:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).send('Error de validación de datos.');
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).send('Error de token JWT.');
        }
        res.status(500).send('Error al registrar la ubicación');
    }
});


app.get('/historialUbicaciones', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuarioId = decoded.userId;

        // Encuentra el usuario por ID y devuelve solo el historial de ubicaciones
        const usuario = await User.findById(usuarioId, 'locationHistory');
        
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado.');
        }

        res.status(200).send(usuario.locationHistory);
    } catch (error) {
        console.error('Error obteniendo el historial de ubicaciones:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send('Error de token JWT.');
        }
        res.status(500).send('Error al obtener el historial de ubicaciones');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

