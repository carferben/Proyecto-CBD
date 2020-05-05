var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Categoria = require("../models/categoria");
const Tienda = require("../models/tienda");

router.get("/mostrar/:id", (req, res) => {
  Categoria.findById(req.params.id, function (err, categoria) {
    if (err) {
      throw err;
    } else {
      Tienda.findById(categoria.tienda, function (err, tienda) {
        if (err) {
          throw err;
        } else {
          Categoria.find({tienda: tienda.id, tipo:'MUJER'}, (err, categoria_mujer) => {
            if (err) {
              throw err;
            } else {
              Categoria.find({tienda: tienda.id, tipo:'HOMBRE'}, (err, categoria_hombre) => {
                if (err) {
                  throw err;
                } else {
                  Categoria.find({tienda: tienda.id, tipo:'NIÑOS'}, (err, categoria_niños) => {
                    if (err) {
                      throw err;
                    } else {
                      Categoria.find({tienda: tienda.id, tipo:'OTRO'}, (err, categoria_otro) => {
                        if (err) {
                          throw err;
                        } else {
                          return res.render("categoria/mostrar", { categoria: categoria, tienda: tienda, categorias_mujer:categoria_mujer, categorias_hombre:categoria_hombre, categorias_niños:categoria_niños, categorias_otro:categoria_otro});
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
