var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Subcategoria = require("../models/subcategoria");
const Categoria = require("../models/categoria");
const Tienda = require("../models/tienda");
const Articulo = require("../models/articulo");


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

router.get("/borrar/:subcategoria", async function (req, res) {
  const subcategoria = await Subcategoria.findById(req.params.subcategoria);
  const tienda = await Tienda.findOne({usuario: req.user});
  if (!subcategoria || !tienda) {
    return res.redirect("/");
  } else {
    const categoria = await Categoria.findById(subcategoria.categoria);
    var categoria_tienda = categoria.tienda;
    var tienda_id = tienda._id;
    if(!categoria_tienda.equals(tienda_id)) {
      return res.redirect("/");
    } else {
      Articulo.deleteMany({subcategoria:subcategoria}, function (err, articulos) {
        if (err) throw err;
      });
      subcategoria.remove(err => { 
        if (err) throw err;
        return res.redirect("/articulo/listar/" + tienda._id + "/" + categoria._id);
      });
    }
  }
});

module.exports = router;
