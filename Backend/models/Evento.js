const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  nombre: String,
  fecha: Date,
  horaInicio: String,
  horaFin: String,
  descripcion: String,
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  idEvento: String
});

module.exports = mongoose.model('Evento', eventoSchema);
