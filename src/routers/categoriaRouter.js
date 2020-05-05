var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Categoria = require("../models/categoria");
const Tienda = require("../models/tienda");
const Subcategoria = require("../models/subcategoria");
const Articulo = require("../models/articulo");


router.get("/mostrar/:id", (req, res) => {
  Categoria.findById(req.params.id, function (err, categoria) {
    if (err) {
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
                  Articulo.find({categoria: categoria}, (err, articulos) => {
                    if (err) {
                      throw err;
                    } else {
                      var categoria_mujer = categorias.filter(c => c.tipo == 'MUJER');
                      var categoria_hombre = categorias.filter(c => c.tipo == 'HOMBRE');
                      var categoria_ninos = categorias.filter(c => c.tipo == 'NIÑOS');
                      var categoria_otro = categorias.filter(c => c.tipo == 'OTROS');
                      return res.render("categoria/mostrar", { articulos:articulos, subcategorias:subcategoria, categoria: categoria, tienda: tienda, categorias_mujer:categoria_mujer, categorias_hombre:categoria_hombre, categorias_ninos:categoria_ninos, categorias_otro:categoria_otro});
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

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

module.exports = router;
