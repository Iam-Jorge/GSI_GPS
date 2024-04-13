const mongoose = require('mongoose');

const asignaturaSchema = new mongoose.Schema({
  nombre: String,
  grado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grado'
  },
  profesores: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }]
});

module.exports = mongoose.model('Asignatura', asignaturaSchema);