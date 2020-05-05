var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Subcategoria = require("../models/subcategoria");
const Categoria = require("../models/categoria")

router.get("/crear/:id", (req, res) => {
  if (!req.user || req.user.rol != "TIENDA" || !req.params.id) return res.redirect("/");
  else res.render("subcategoria/crear");
});

router.post("/crear/:id", function (req, res) {
  if (!req.user || req.user.rol != "TIENDA") return res.redirect("/");
  else {
    subcategoria = new Subcategoria();

    subcategoria._id = new mongoose.Types.ObjectId();
    subcategoria.nombre = req.body.nombre;
    subcategoria.descripcion = req.body.descripcion;

    Categoria.findById(req.params.id, (err, categoria) => {
      if (err) {
        console.log("No se ha encontrado la categoria del usuario");
        throw err;
      }
      subcategoria.categoria = categoria.id;

      subcategoria.save(function (err) {
        if (err) {
          console.log("Error al crear la subcategoria: " + err);
          throw err;
        } else {
          return res.render("categoria/mostrar", { categoria: categoria});
        }
      });
    });
  }
});

module.exports = router;
