const mongoose = require('mongoose');

const claseSchema = new mongoose.Schema({
  asignatura: { type: mongoose.Schema.Types.ObjectId, ref: 'Asignatura' },
  profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor' },
  fecha: Date,
  horaInicio: String,
  horaFin: String,
  idClase: String,
  descripcion: { type: String, default: '' },
  estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Clase', claseSchema);
