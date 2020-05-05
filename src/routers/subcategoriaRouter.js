var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Subcategoria = require("../models/subcategoria");
const Categoria = require("../models/categoria")
const Tienda = require("../models/tienda")

router.get("/crear/:id", (req, res) => {
  if (!req.user || req.user.rol != "TIENDA" || !req.params.id) return res.redirect("/");
  else res.render("subcategoria/crear");
});

router.post("/crear/:id", function (req, res) {
  if (!req.user || req.user.rol != "TIENDA"){
   return res.redirect("/");
  } else {
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
          Tienda.findById(categoria.tienda, function (err, tienda) {
            if (err) {
              throw err;
            } else {
              Categoria.find({tienda: tienda.id}, (err, categorias) => {
                if (err) {
                  throw err;
                } else {
                  Subcategoria.find({categoria:categoria._id }, (err, subcategoria) => {
                    if (err) {
                      throw err;
                    } else {
                      var categoria_mujer = categorias.filter(c => c.tipo == 'MUJER');
                      var categoria_hombre = categorias.filter(c => c.tipo == 'HOMBRE');
                      var categoria_ninos = categorias.filter(c => c.tipo == 'NIÑOS');
                      var categoria_otro = categorias.filter(c => c.tipo == 'OTROS');
                      return res.render("categoria/mostrar", { categoria: categoria, subcategorias:subcategoria,  tienda: tienda, categorias_mujer:categoria_mujer, categorias_hombre:categoria_hombre, categorias_ninos:categoria_ninos, categorias_otro:categoria_otro});
                    }
                  });
                }
              });
            }
          });
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
        return res.render("subcategoria/editar", { subcategoria: subcategoria });
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
        subcategoria.descripcion = req.body.descripcion;

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
