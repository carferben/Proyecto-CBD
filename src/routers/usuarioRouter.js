var express = require("express");
var router = express.Router();
const Tienda = require("../models/tienda");
const Categoria = require("../models/categoria");
const Subcategoria = require("../models/subcategoria");
const Articulo = require("../models/articulo");
const Usuario = require("../models/usuario");

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

module.exports = function(passport) {
  router.get("/registro", (req, res) => {
    res.render("usuario/registro", { message: req.flash("message") });
  });

  router.post(
    "/registro",
    passport.authenticate("registro", {
      successRedirect: "/",
      failureRedirect: "/usuario/registro",
      failureFlash: true
    })
  );

  router.get("/entrar", (req, res) => {
    res.render("usuario/entrar", { message: req.flash("message") });
  });

  router.post(
    "/entrar",
    passport.authenticate("entrar", {
      successRedirect: "/",
      failureRedirect: "/",
      failureFlash: true
    })
  );

  router.get("/salir", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  return router;
};

router.get("/editar", (req, res) => {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  else res.render("usuario/editar", {usuario: usuario});
});

router.post("/editar", function(req, res) {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  else {

    usuario.email = req.body.email;
    usuario.nombre = req.body.nombre;
    usuario.apellidos = req.body.apellidos;
    usuario.dni = req.body.dni;

    usuario.save(function(err) {
      if (err) {
        console.log("Error al editar la usuario: " + err);
        throw err;
      } else return res.redirect("/");
    });
  }
});

router.get("/borrar", async function (req, res) {
  usuario = req.user;
  if (!usuario || usuario.rol != "TIENDA") return res.redirect("/");
  const tienda = await Tienda.find({usuario:usuario._id});
  const categorias = await Categoria.find({tienda: tienda._id});
  Articulo.deleteMany({categoria:categorias._id}, function (err, articulos) {
    if (err) throw err;
  });
  Subcategoria.deleteMany({categoria:categorias._id}, function (err, subcategorias) {
    if (err) throw err;
  });
  Categoria.deleteMany({tienda:tienda.id}, function (err, categoria) {
    if (err) throw err;
  });
  Tienda.deleteMany({usuario:usuario._id}, function (err, tienda) {
    if (err) throw err;
  });
  usuario.remove(err => { 
    if (err) throw err;
    return res.redirect("/");
  });
});

