const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Esquéma de artículo
const tiendaSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  descripcion: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  imagen: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  calle: {
    type: String,
    required: true
  },
  codigo_postal: {
    type: String,
    required: true
  },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

const Tienda = (module.exports = mongoose.model("Tienda", tiendaSchema));
