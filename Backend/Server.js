require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./User');
const bcrypt = require('bcryptjs');

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
            // Este bloque se ejecuta si hay un error de duplicado
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
        res.status(200).send('Login exitoso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

