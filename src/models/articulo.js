const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Esquéma de artículo
const articuloSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  material: {
    type: String
  },
  imagen: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  lugar_de_fabricacion: {
    type: String,
    required: true
  },
  subcategoria: { type: Schema.Types.ObjectId, ref: "Subcategoria" }
});

const Articulo = (module.exports = mongoose.model("Articulo", articuloSchema));
