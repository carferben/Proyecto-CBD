var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Articulo = require("../models/articulo");
const Tienda = require("../models/tienda");
const Subcategoria = require("../models/subcategoria");
const Categoria = require("../models/categoria");

router.get("/listar/:tienda/:categoria/:subcategoria?", async (req, res) => {
  var page = req.query.page;
  if (!page) page = 0;
  var search = req.query.search;
  if (!search) search = "";
  var re = new RegExp(search, "i");
  const tienda = await Tienda.findById(req.params.tienda);
  const categoria = await Categoria.findById(req.params.categoria);
  const subcategoria = await Subcategoria.findById(req.params.subcategoria);

  var count;
  var articulos;
  if (req.params.subcategoria) {
    count = await Articulo.countDocuments({
      subcategoria: req.params.subcategoria,
    }).or([{ nombre: { $regex: re } }, { descripcion: { $regex: re } }]);
    articulos = await Articulo.find({
      subcategoria: req.params.subcategoria,
    })
      .or([{ nombre: { $regex: re } }, { descripcion: { $regex: re } }])
      .skip(6 * page)
      .limit(6);
  } else {
    count = await Articulo.countDocuments({
      categoria: categoria._id,
    }).or([{ nombre: { $regex: re } }, { descripcion: { $regex: re } }]);
    articulos = await Articulo.find({
      categoria: categoria._id,
    })
      .or([{ nombre: { $regex: re } }, { descripcion: { $regex: re } }])
      .skip(6 * page)
      .limit(6);
  }
  const categorias = await Categoria.find({ tienda: tienda._id });
  const subcategorias = await Subcategoria.find({
    categoria: categoria,
  });
  search = search == "" ? "" : "?search=" + search;
  var categorias_mujer = categorias.filter((c) => c.tipo == "MUJER");
  var categorias_hombre = categorias.filter((c) => c.tipo == "HOMBRE");
  var categorias_ninos = categorias.filter((c) => c.tipo == "NIÑOS");
  var categorias_otro = categorias.filter((c) => c.tipo == "OTRO");
  return res.render("categoria/mostrar", {
    tienda: tienda,
    categorias: categorias,
    subcategoria:subcategoria,
    subcategorias: subcategorias,
    categoria: categoria,
    articulos: articulos,
    page: page,
    totalItems: count,
    categorias_mujer: categorias_mujer,
    categorias_hombre: categorias_hombre,
    categorias_ninos: categorias_ninos,
    categorias_otro: categorias_otro,
    search: search
  });
});

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
        var categoria_otro = categorias.filter((c) => c.tipo == "OTRO");
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

router.post("/crear", async function (req, res) {
  if (!req.user || req.user.rol != "TIENDA") return res.redirect("/");
  else {
    var articulo = new Articulo();

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
    var tienda = await Tienda.findOne({ usuario: req.user.id });
    articulo.save(function (err) {
      if (err) {
        console.log("Error al crear artículo: " + err);
        throw err;
      } else return res.redirect("/articulo/listar/" + tienda._id + "/" + articulo.categoria);
    });
  }
});

router.get("/editar/:articulo/:categoria", (req, res) => {
  if (!req.user || req.user.rol != "TIENDA") return res.redirect("/");
  else {
    Articulo.findById(req.params.articulo, async function (err, articulo) {
      if (err) {
        throw err; 
      } else {
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
          var categoria_otro = categorias.filter((c) => c.tipo == "OTRO");
          Subcategoria.find(
            { categoria: req.params.categoria },
            (err, subcategorias) => {
              if (err) {
                throw err;
              }
              res.render("articulo/editar", {
                tienda: tienda,
                articulo:articulo,
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
  }
});

router.post("/editar/:articulo/:categoria", function (req, res) {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  else {
    Articulo.findById(req.params.articulo, async function (err, articulo) {
      if (err) {
        throw err;
      } else {

        articulo.nombre = req.body.nombre;
        articulo.descripcion = req.body.descripcion;
        articulo.material = req.body.material;
        articulo.imagen = req.body.imagen;
        articulo.precio = req.body.precio;
        articulo.lugar_de_fabricacion = req.body.lugar_de_fabricacion;
        articulo.tallas = req.body.tallas;
        Subcategoria.find({nombre:req.body.subcategoria}, async function (err, subcategoria) {
          if (err) {
            throw err;
          } else {
            console.log(subcategoria);
            articulo.subcategoria = subcategoria[0]._id;
            articulo.categoria = subcategoria[0].categoria._id;
            var tienda = await Tienda.findOne({ usuario: req.user.id });

            articulo.save(function (err) {
              if (err) {
                console.log("Error al editar artículo: " + err);
                throw err;
              } else return res.redirect("/articulo/listar/" + tienda._id + "/" + articulo.categoria);
            });
          }
        });
      }
    });
  }
});

router.get("/mostrar/:articulo/:tienda", async function (req, res) {
  Articulo.findById(req.params.articulo, async function (err, articulo) {
    if (err) {
      throw err;
    } else {
      const tienda = await Tienda.findById(req.params.tienda);
      const categorias = await Categoria.find({ tienda: tienda._id });
      var categorias_mujer = categorias.filter((c) => c.tipo == "MUJER");
      var categorias_hombre = categorias.filter((c) => c.tipo == "HOMBRE");
      var categorias_ninos = categorias.filter((c) => c.tipo == "NIÑOS");
      var categorias_otro = categorias.filter((c) => c.tipo == "OTRO");
      return res.render("articulo/mostrar", {
        tienda: tienda,
        categorias: categorias,
        articulo: articulo,
        categorias_mujer: categorias_mujer,
        categorias_hombre: categorias_hombre,
        categorias_ninos: categorias_ninos,
        categorias_otro: categorias_otro,
      });
    }
  });
});

router.get("/borrar/:articulo/:tienda/:categoria", async function (req, res) {
  const articulo = await Articulo.findById(req.params.articulo);
  const tienda = await Tienda.findById(req.params.tienda);
  const categoria = await Categoria.findById(req.params.categoria);
  articulo.remove(err => { 
    if (err) throw err;
      return res.redirect("/articulo/listar/" + tienda._id + "/" + categoria._id);
  });
});

module.exports = router;
