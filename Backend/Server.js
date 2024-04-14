require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3000;

// Modelos
const Asignatura = require('./models/Asignatura');
const Clase = require('./models/Clase');
const Evento = require('./models/Evento');
const Grado = require('./models/Grado');
const User = require('./models/User');


app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((e) => console.error("Error conectando a MongoDB Atlas:", e));

// Generación de códigos numéricos para clases y eventos
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Autenticación y manejo de usuarios
app.post('/registero', async (req, res) => {
  const { email, password, name, role, securityCode } = req.body;
  if (!['estudiante', 'profesor', 'administrador'].includes(role) ||
      (role === 'profesor' && securityCode !== process.env.PROFESSOR_CODE) ||
      (role === 'administrador' && securityCode !== process.env.ADMIN_CODE)) {
    return res.status(400).send('Datos de registro no válidos.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({ email, password: hashedPassword, nombre: name, role });
    const savedUser = await newUser.save();

    // Generar un token JWT para el nuevo usuario
    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Enviar el token y los datos del usuario al cliente
    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        nombre: savedUser.nombre,
        role: savedUser.role
      },
      token
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).send('El email ya está registrado.');
    } else {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('Usuario no encontrado.');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send('Contraseña incorrecta.');

  const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.status(200).send({ token, user: { id: user._id, email: user.email, nombre: user.nombre, role: user.role } });
});

app.post('/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('Usuario no encontrado.');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(401).send('Contraseña actual incorrecta.');

  const hashedNewPassword = await bcrypt.hash(newPassword, 8);
  user.password = hashedNewPassword;
  await user.save();
  res.status(200).send('Contraseña actualizada con éxito.');
});

  // Ruta para añadir un estudiante a un evento
  app.post('/registro-actividad', async (req, res) => {
    const { codigo, userId, latitud, longitud } = req.body;
  
    try {
      let updatedData = null;
  
      // Buscar clase o evento por código
      const clase = await Clase.findOne({ idClase: codigo });
      if (clase) {
        if (!clase.estudiantes.includes(userId)) {
          clase.estudiantes.push(userId);
          updatedData = clase;
        }
      } else {
        const evento = await Evento.findOne({ idEvento: codigo });
        if (evento && !evento.participantes.includes(userId)) {
          evento.participantes.push(userId);
          updatedData = evento;
        }
      }
  
      if (!updatedData) {
        return res.status(404).send('Código de actividad ya registrado.');
      }
  
      // Registrar la ubicación si se proporciona y el usuario no estaba ya registrado
      if (latitud && longitud) {
        await User.findByIdAndUpdate(userId, {
          $push: { locationHistory: { latitude: latitud, longitude: longitud, timestamp: new Date() }}
        });
      }
  
      // Guardar cambios y enviar respuesta
      await updatedData.save();
      res.status(200).send('Registro de actividad y ubicación completados con éxito.');
    } catch (error) {
      console.error('Error al registrar la actividad y ubicación:', error);
      res.status(500).send('Error en el servidor: ' + error.message);
    }
  });
  

// Gestión de perfiles
app.route('/perfil')
  .get(async (req, res) => {
    const userId = req.user?.id;  // Necesita autenticación
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');
    res.send({ nombre: user.nombre, email: user.email });
  })
  .put(async (req, res) => {
    const { nombre, email } = req.body;
    const userId = req.user?.id;
    const user = await User.findByIdAndUpdate(userId, { nombre, email }, { new: true });
    if (!user) return res.status(404).send('Usuario no encontrado');
    res.send({ nombre: user.nombre, email: user.email });
  });

// Registro de ubicaciones
app.post('/registrarUbicacion', async (req, res) => {
  const { latitud, longitud, timestamp } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.userId;

    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado.');
    }

    usuario.locationHistory.push({
      latitude: latitud,
      longitude: longitud,
      timestamp: new Date(timestamp)
    });

    await usuario.save();

  } catch (error) {
    console.error('Error al registrar la ubicación:', error);
    if (error.name === "JsonWebTokenError") {
      res.status(401).send('Token inválido');
    } else {
      res.status(500).send('Error en el servidor');
    }
  }
});

app.get('/historialUbicaciones/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const usuario = await User.findById(userId).select('locationHistory');
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado.');
    }
    res.status(200).json(usuario.locationHistory);
  } catch (error) {
    console.error('Error al cargar las ubicaciones históricas:', error);
    res.status(500).send('Error al cargar las ubicaciones históricas');
  }
});

// Gestión de grados y asignaturas
app.route('/grados')
  .get(async (req, res) => res.status(200).send(await Grado.find()))
  .post(async (req, res) => res.status(201).send(await new Grado({ nombre: req.body.nombre }).save()));

app.route('/asignaturas')
  .get(async (req, res) => res.status(200).json(await Asignatura.find().populate('grado profesores')))
  .post(async (req, res) => {
    try {
      const { nombre, gradoId, profesorId } = req.body;
      const asignatura = await new Asignatura({ nombre, grado: gradoId, profesores: profesorId ? [profesorId] : [] }).save();
      res.status(201).json(asignatura);
    } catch (error) {
      res.status(500).send('Error al guardar la asignatura: ' + error.message);
    }
  });

app.delete('/asignaturas/:id', async (req, res) => {
  try {
    await Asignatura.findByIdAndDelete(req.params.id);
    res.status(200).send('Asignatura eliminada correctamente.');
  } catch (error) {
    res.status(500).send('Error al eliminar la asignatura: ' + error.message);
  }
});

app.delete('/grados/:id', async (req, res) => {
  try {
    const gradoEliminado = await Grado.findByIdAndDelete(req.params.id);
    if (!gradoEliminado) {
      return res.status(404).send('Grado no encontrado.');
    }
    res.status(200).send('Grado eliminado correctamente.');
  } catch (error) {
    res.status(500).send('Error al eliminar el grado: ' + error.message);
  }
});

// Gestión de clases y eventos
app.get('/clases/:profesorId', async (req, res) => {
  res.json(await Clase.find({ profesor: req.params.profesorId }).populate('asignatura'));
});

app.post('/clases', async (req, res) => {
  try {
    const { asignatura, profesor, fecha, horaInicio, horaFin, descripcion, estudiantes } = req.body;
    const idClase = generateCode();
    const nuevaClase = await new Clase({ asignatura, profesor, fecha, horaInicio, horaFin, idClase, descripcion, estudiantes }).save();
    res.status(201).json(nuevaClase);
  } catch (error) {
    res.status(500).send('Error al guardar la clase: ' + error.message);
  }
});

app.post('/eventos', async (req, res) => {
  try {
    const { nombre, fecha, horaInicio, horaFin, descripcion, participantes } = req.body;
    const idEvento = generateCode();
    const evento = await new Evento({ nombre, fecha, horaInicio, horaFin, descripcion, participantes, idEvento }).save();
    res.status(201).json({ evento, idEvento });
  } catch (error) {
    res.status(500).send('Error al guardar el evento: ' + error.message);
  }
});

app.get('/clases/:claseId/estudiantes', async (req, res) => {
  try {
    const clase = await Clase.findById(req.params.claseId).populate({
      path: 'estudiantes',
      select: 'nombre email locationHistory',
      populate: {
        path: 'locationHistory',
        model: 'User'
      }
    });

    if (!clase) {
      return res.status(404).send('Clase no encontrada');
    }

    res.json(clase.estudiantes);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener usuarios por rol
app.get('/users/rol/:rol', async (req, res) => {
  try {
    const users = await User.find({ role: req.params.rol });
    if (users.length === 0) return res.status(404).send('No se encontraron usuarios con ese rol.');
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios por rol:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
