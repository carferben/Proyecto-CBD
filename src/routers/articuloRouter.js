var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Articulo = require("../models/articulo");
const Tienda = require("../models/tienda");
const Subcategoria = require("../models/subcategoria");
const Categoria = require("../models/categoria");

router.get("/crear/:categoria", (req, res) => {
  if (!req.user || req.user.rol != "TIENDA") return res.redirect("/");
  else {
    Tienda.findOne({ usuario: req.user._id }, (err, tienda) => {
      if (err || !tienda) {
        throw err;
      }
      Categoria.find({ tienda: tienda.id }, (err, categorias) => {
        if (err) {
          throw err;
        }
        var categoria_mujer = categorias.filter((c) => c.tipo == "MUJER");
        var categoria_hombre = categorias.filter((c) => c.tipo == "HOMBRE");
        var categoria_ninos = categorias.filter((c) => c.tipo == "NIÑOS");
        var categoria_otro = categorias.filter((c) => c.tipo == "OTROS");
        Subcategoria.find(
          { categoria: req.params.categoria },
          (err, subcategorias) => {
            if (err) {
              throw err;
            }
            res.render("articulo/crear", {
              tienda: tienda,
              categorias: categorias,
              subcategorias: subcategorias,
              categorias_mujer: categoria_mujer,
              categorias_hombre: categoria_hombre,
              categorias_ninos: categoria_ninos,
              categorias_otro: categoria_otro,
            });
          }
        );
      });
    });
  }
});

router.post("/crear", function (req, res) {
  if (!req.user || req.user.rol != "TIENDA") return res.redirect("/");
  else {
    articulo = new Articulo();

    articulo._id = new mongoose.Types.ObjectId();
    articulo.nombre = req.body.nombre;
    articulo.descripcion = req.body.descripcion;
    articulo.material = req.body.material;
    articulo.imagen = req.body.imagen;
    articulo.precio = req.body.precio;
    articulo.lugar_de_fabricacion = req.body.lugar_de_fabricacion;
    articulo.tallas = req.body.tallas;
    var subcat = JSON.parse(req.body.subcategoria);
    articulo.subcategoria = subcat._id;
    articulo.categoria = subcat.categoria;
    articulo.save(function (err) {
      if (err) {
        console.log("Error al crear artículo: " + err);
        throw err;
      } else return res.redirect("/tienda/mostrar");
    });
  }
});

module.exports = router;
