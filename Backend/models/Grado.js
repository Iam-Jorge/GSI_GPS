  const mongoose = require('mongoose');

  const gradoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    asignaturas: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asignatura'
    }]
    // Puedes añadir más campos aquí según sea necesario
  });

  module.exports = mongoose.model('Grado', gradoSchema);
