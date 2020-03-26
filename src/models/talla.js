const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Esquéma de artículo
const tallaSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  nombre: {
    type: String,
    required: true
  },
  categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' },
  articulo: { type: Schema.Types.ObjectId, ref: 'Articulo' }
});

const Talla = (module.exports = mongoose.model("Talla", tallaSchema));
