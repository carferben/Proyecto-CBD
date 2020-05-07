var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Subcategoria = require("../models/subcategoria");
const Categoria = require("../models/categoria");
const Tienda = require("../models/tienda");
const Articulo = require("../models/articulo");

router.get("/articulos/:tienda/:categoria/:subcategoria", async function (
  req,
  res
) {
  const tienda = await Tienda.findById(req.params.tienda);
  const articulos = await Articulo.find({
    subcategoria: req.params.subcategoria,
  });
  const categoria = await Categoria.findById(req.params.categoria);
  const categorias = await Categoria.find({ tienda: tienda._id });
  const subcategorias = await Subcategoria.find({
    categoria: categoria,
  });

  var categorias_mujer = categorias.filter((c) => c.tipo == "MUJER");
  var categorias_hombre = categorias.filter((c) => c.tipo == "HOMBRE");
  var categorias_ninos = categorias.filter((c) => c.tipo == "NIÑOS");
  var categorias_otro = categorias.filter((c) => c.tipo == "OTROS");
  return res.render("categoria/mostrar", {
    tienda: tienda,
    categorias: categorias,
    subcategorias: subcategorias,
    categoria: categoria,
    articulos: articulos,
    categorias_mujer: categorias_mujer,
    categorias_hombre: categorias_hombre,
    categorias_ninos: categorias_ninos,
    categorias_otro: categorias_otro,
  });
});

router.get("/crear/:id", (req, res) => {
  if (!req.user || req.user.rol != "TIENDA" || !req.params.id)
    return res.redirect("/");
  else res.render("subcategoria/crear");
});

router.post("/crear/:id", function (req, res) {
  if (!req.user || req.user.rol != "TIENDA") {
    return res.redirect("/");
  } else {
    subcategoria = new Subcategoria();

    subcategoria._id = new mongoose.Types.ObjectId();
    subcategoria.nombre = req.body.nombre;

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
          return res.redirect("/articulo/listar/" + categoria.tienda + "/" + categoria.id);
        }
      });
    });
  }
});

router.get("/editar/:id", (req, res) => {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  else {
    Subcategoria.findById(req.params.id, function (err, subcategoria) {
      if (err) {
        throw err;
      } else {
        return res.render("subcategoria/editar", {
          subcategoria: subcategoria,
        });
      }
    });
  }
});

router.post("/editar/:id", function (req, res) {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  else {
    Subcategoria.findById(req.body._id, function (err, subcategoria) {
      if (err) {
        throw err;
      } else {
        subcategoria.nombre = req.body.nombre;

        subcategoria.save(function (err) {
          if (err) {
            console.log("Error al editar la subcategoria: " + err);
            throw err;
          } else {
            return res.redirect("/tienda/mostrar");
          }
        });
      }
    });
  }
});

module.exports = router;
