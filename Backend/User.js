const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Definicion del Usuario
const userSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: String,
  locationHistory: [{
    latitude: Number,
    longitude: Number,
    timestamp: Date,
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
