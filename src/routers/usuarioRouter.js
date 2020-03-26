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
