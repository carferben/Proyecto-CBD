var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Tienda = require("../models/tienda");

router.get("/crear", (req, res) => {
  if (!req.user || req.user.rol != "TIENDA") return res.redirect("/");
  else res.render("tienda/crear");
});

router.post("/crear", function(req, res) {
  if (!req.user || req.user.rol != "TIENDA") return res.redirect("/");
  else {
    tienda = new Tienda();

    tienda._id = new mongoose.Types.ObjectId();
    tienda.nombre = req.body.nombre;
    tienda.descripcion = req.body.descripcion;
    tienda.email = req.body.email;
    tienda.imagen = req.body.imagen;
    tienda.ciudad = req.body.ciudad;
    tienda.calle = req.body.calle;
    tienda.codigo_postal = req.body.codigo_postal;
    tienda.usuario = req.user._id;

    tienda.save(function(err) {
      if (err) {
        console.log("Error al crear la tienda: " + err);
        throw err;
      } else return res.redirect("/");
    });
  }
});

module.exports = router;
