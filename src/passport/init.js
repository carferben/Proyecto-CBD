var entrar = require("./entrar");
var registro = require("./registro");
var Usuario = require("../models/usuario");

module.exports = function(passport) {
  passport.serializeUser(function(usuario, done) {
    done(null, usuario._id);
  });

  passport.deserializeUser(function(id, done) {
    Usuario.findById(id, function(err, usuario) {
      done(err, usuario);
    });
  });

  entrar(passport);
  registro(passport);
};
