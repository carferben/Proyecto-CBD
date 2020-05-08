var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Categoria = require("../models/categoria");
const Tienda = require("../models/tienda");
const Subcategoria = require("../models/subcategoria");
const Articulo = require("../models/articulo");

router.get("/crear", (req, res) => {
  if (!req.user || req.user.rol != "TIENDA") return res.redirect("/");
  else res.render("categoria/crear");
});

router.post("/crear", function (req, res) {
  if (!req.user || req.user.rol != "TIENDA") return res.redirect("/");
  else {
    categoria = new Categoria();

    categoria._id = new mongoose.Types.ObjectId();
    categoria.nombre = req.body.nombre;
    categoria.tipo = req.body.tipo;
    Tienda.findOne({ usuario: req.user._id }, (err, tienda) => {
      if (err) {
        console.log("No se ha encontrado la tienda del usuario");
        throw err;
      }
      categoria.tienda = tienda._id;
      categoria.save(function (err) {
        if (err) {
          console.log("Error al crear la categoria: " + err);
          throw err;
        } else return res.redirect("/tienda/mostrar");
      });
    });
  }
});

router.get("/editar/:id", (req, res) => {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  else {
    Categoria.findById(req.params.id, function (err, categoria) {
      if (err) {
        throw err;
      } else {
        return res.render("categoria/editar", { categoria: categoria });
      }
    });
  }
});

router.post("/editar/:id", function (req, res) {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  else {
    Categoria.findById(req.body._id, function (err, categoria) {
      if (err) {
        throw err;
      } else {
        categoria.nombre = req.body.nombre;
        categoria.tipo = req.body.tipo;

        categoria.save(function (err) {
          if (err) {
            console.log("Error al editar la categoria: " + err);
            throw err;
          } else {
            return res.redirect("/tienda/mostrar");
          }
        });
      }
    });
  }
});

router.get("/borrar/:categoria/:tienda", async function (req, res) {
  const tienda = await Tienda.findById(req.params.tienda);
  const categoria = await Categoria.findById(req.params.categoria);
  Articulo.deleteMany({categoria:req.params.categoria}, function (err, articulos) {
    if (err) throw err;
  });
  Subcategoria.deleteMany({categoria:req.params.categoria}, function (err, subcategorias) {
    if (err) throw err;
  });
  categoria.remove(err => { 
    if (err) throw err;
    return res.redirect("/tienda/mostrar/" + tienda._id);
  });
});

module.exports = router;
