const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
// Esquéma de artículo
const usuarioSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  nombre_de_usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    required: true,
    trim: true
  },
  rol: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  dni: {
    type: String,
    required: true,
    unique: true
  }
});

const Usuario = (module.exports = mongoose.model("Usuario", usuarioSchema));
