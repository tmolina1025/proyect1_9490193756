// src/models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  CorreoElectronico: { type: String, required: true, unique: true },
  Clave: { type: String, required: true },
  Nombres: { type: String, required: true },
  Apellidos: { type: String, required: true },
  FechaNacimiento: { type: Date, required: true },
  DireccionEntrega: { type: String, required: true },
  NIT: { type: String, required: true, unique: true},
  NumeroTelefonico: { type: String, required: true },
  DPI: {type: String, required: true, unique: true},
  Rol: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

export default User;