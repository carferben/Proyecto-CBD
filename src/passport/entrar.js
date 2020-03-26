var LocalStrategy = require("passport-local").Strategy;
var Usuario = require("../models/usuario");
var bCrypt = require("bcrypt");

module.exports = function(passport) {
  passport.use(
    "entrar",
    new LocalStrategy(
      {
        usernameField: "nombre_de_usuario",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, nombre_de_usuario, password, done) {
        Usuario.findOne({ nombre_de_usuario: nombre_de_usuario }, function(
          err,
          usuario
        ) {
          if (err) return done(err);
          if (!usuario) {
            console.log("No se ha encontrado el usuario " + usuario);
            return done(
              null,
              false,
              req.flash("message", "Usuario no encontrado")
            );
          }
          if (!isValidPassword(usuario, password)) {
            console.log("Contraseña incorrecta");
            return done(
              null,
              false,
              req.flash("message", "Contraseña incorrecta")
            ); // redirect back to login page
          }
          return done(null, usuario);
        });
      }
    )
  );

  var isValidPassword = function(usuario, password) {
    return bCrypt.compareSync(password, usuario.password);
  };
};
