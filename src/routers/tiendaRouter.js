var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Tienda = require("../models/tienda");

router.get("/mostrar/:id", (req, res) => {
  console.log(req.params.id)
  Tienda.findById(req.params.id, function(err, tienda){
    if(err) {
      throw err;
    } else {
      return res.render('tienda/mostrar', {tienda: tienda});
    }
  });
});


router.get("/add", (req, res) => {
  // var tienda1 = new Tienda({
  //   _id: new mongoose.Types.ObjectId(),
  //   nombre: "Acme Jardines",
  //   descripcion: "Especializados en decoración para patios y jardines.",
  //   email: "acmejardines@gmail.com",
  //   imagen:
  //     "https://losjardinesdekyoto.com/wp-content/uploads/2016/05/los-jardines-de-kyoto-tienda.jpg",
  //   ciudad: "Carmona, Sevilla",
  //   calle: "Calle Hilanderos 13",
  //   codigo_postal: "41410"
  // });
  // tienda1.save(err => {
  //   if (err) {
  //     console.error(err);
  //   }
  // });
});

module.exports = router;
