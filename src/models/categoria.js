const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Esquéma de artículo
const categoriaSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  tienda: { type: Schema.Types.ObjectId, ref: 'Tienda' }
});

const Categoria = (module.exports = mongoose.model("Categoria", categoriaSchema));
