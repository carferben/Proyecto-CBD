const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Esquéma de artículo
const subcategoriaSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  nombre: {
    type: String,
    required: true
  },
  categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' }
});

const Subcategoria = (module.exports = mongoose.model("Subcategoria", subcategoriaSchema));
