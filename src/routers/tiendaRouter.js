var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Tienda = require("../models/tienda");
const Categoria = require("../models/categoria");
const Subcategoria = require("../models/subcategoria");
const Articulo = require("../models/articulo");

router.get("/mostrar/:id", (req, res) => {
  Tienda.findById(req.params.id, function (err, tienda) {
    if (err) {
      throw err;
    } else {
      if(!tienda) {
        return res.render("tienda/crear");
      } else {
        Categoria.find({tienda: tienda.id}, (err, categorias) => {
          if (err) {
            throw err;
          } else {
            var categoria_mujer = categorias.filter(c => c.tipo == 'MUJER');
            var categoria_hombre = categorias.filter(c => c.tipo == 'HOMBRE');
            var categoria_ninos = categorias.filter(c => c.tipo == 'NIÑOS');
            var categoria_otro = categorias.filter(c => c.tipo == 'OTROS');
            return res.render("tienda/mostrar", { tienda: tienda, categorias_mujer:categoria_mujer, categorias_hombre:categoria_hombre, categorias_ninos:categoria_ninos, categorias_otro:categoria_otro});
          }
        });
      }
    }
  })
});

router.get("/crear", (req, res) => {
  if (!req.user || req.user.rol != "TIENDA") return res.redirect("/");
  else res.render("tienda/crear");
});

router.post("/crear", function (req, res) {
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

    tienda.save(function (err) {
      if (err) {
        console.log("Error al crear la tienda: " + err);
        throw err;
      } else return res.redirect("/tienda/mostrar/" + tienda._id);
    });
  }
});

router.get("/mostrar", (req, res) => {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  else {
    Tienda.findOne({ usuario: usuario._id }, function (err, tienda) {
      if (err) {
        throw err;
      } else {
        if(!tienda) {
          return res.render("tienda/crear");
        } else {
          Categoria.find({tienda: tienda.id}, (err, categorias) => {
            if (err) {
              throw err;
            } else {
              var categoria_mujer = categorias.filter(c => c.tipo == 'MUJER');
              var categoria_hombre = categorias.filter(c => c.tipo == 'HOMBRE');
              var categoria_ninos = categorias.filter(c => c.tipo == 'NIÑOS');
              var categoria_otro = categorias.filter(c => c.tipo == 'OTROS');
              return res.render("tienda/mostrar", { tienda: tienda, categorias_mujer:categoria_mujer, categorias_hombre:categoria_hombre, categorias_ninos:categoria_ninos, categorias_otro:categoria_otro});
            }
          });
        }
      }
    });
  }
});


router.get("/editar", (req, res) => {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  else {
    Tienda.findOne({ usuario: usuario._id }, function (err, tienda) {
      if (err) {
        throw err;
      } else {
        return res.render("tienda/editar", { tienda: tienda });
      }
    });
  }
});

router.post("/editar", function (req, res) {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  else {
    Tienda.findOne({ usuario: usuario._id }, function (err, tienda) {
      if (err) {
        throw err;
      } else {
        tienda.nombre = req.body.nombre;
        tienda.descripcion = req.body.descripcion;
        tienda.email = req.body.email;
        tienda.imagen = req.body.imagen;
        tienda.ciudad = req.body.ciudad;
        tienda.calle = req.body.calle;
        tienda.codigo_postal = req.body.codigo_postal;

        tienda.save(function (err) {
          if (err) {
            console.log("Error al editar la tienda: " + err);
            throw err;
          } else {
            return res.render("tienda/mostrar", { tienda: tienda });
          }
        });
      }
    });
  }
});

router.get("/borrar/:tienda", async function (req, res) {
  const tienda = await Tienda.findById(req.params.tienda);
  Categoria.find({tienda:tienda.id}, async function (err, categorias) {
    if (err) throw err; 
    Subcategoria.find({categoria:categorias}, async function (err, subcategoria) {
      if (err) throw err; 

      for (let i = 0; i < subcategoria.length; i++) {
        Articulo.find({subcategoria:subcategoria[i]}, async function (err, articulos) {
          if (err)  throw err; 
          for (let i = 0; i < articulos.length; i++) {
            articulos[i].remove(err => { 
              if (err) {
                console.log("Error al borrar artículo: " + err);
                throw err;
              }
            });
          }
        });
        subcategoria[i].remove(err => { 
          if (err) {
            console.log("Error al borrar subcategoria: " + err);
            throw err;
          }
        });
      }
        
      for (let i = 0; i < categorias.length; i++) {
        categorias[i].remove(err => { 
          if (err) {
            console.log("Error al borrar categoria: " + err);
            throw err;
          }
        });
      }
      tienda.remove(err => { 
        if (err) {
          console.log("Error al borrar tienda: " + err);
          throw err;
        } else {
          return res.redirect("/tienda/mostrar/" + tienda._id);
        }
      });
    });
  });
});

module.exports = router;
