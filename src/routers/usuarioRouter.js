var express = require("express");
var router = express.Router();

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
  if (!usuario) return res.redirect("/");
  else res.render("usuario/editar", {usuario: usuario});
});

router.post("/editar", function(req, res) {
  if (!req.user) return res.redirect("/");
  else {
    usuario = req.user;
    console.log(usuario);
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
