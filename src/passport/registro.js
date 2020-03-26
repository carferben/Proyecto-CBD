var LocalStrategy = require("passport-local").Strategy;
var Usuario = require("../models/usuario");
var mongoose = require("mongoose")
var bCrypt = require("bcrypt");

module.exports = function(passport) {
  passport.use(
    "registro",
    new LocalStrategy(
      {
        usernameField: "nombre_de_usuario",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, nombre_de_usuario, password, done) {
        Usuario.findOne({ nombre_de_usuario: nombre_de_usuario }, function(
          err,
          usuario
        ) {
          if (err) {
            console.log("Error de registro: " + err);
            return done(err);
          }
          if (usuario) {
            console.log(
              "Ya existe el usuario con el nombre: " + nombre_de_usuario
            );
            return done(
              null,
              false,
              req.flash("message", "El usuario ya existe")
            );
          } else {
            var newUser = new Usuario();

            newUser._id = new mongoose.Types.ObjectId();
            newUser.nombre_de_usuario = req.body.nombre_de_usuario;
            newUser.password = createHash(password);
            newUser.email = req.body.email;
            newUser.nombre = req.body.nombre;
            newUser.apellidos = req.body.apellidos;
            newUser.dni = req.body.dni;
            newUser.rol = "TIENDA";

            newUser.save(function(err) {
              if (err) {
                console.log("Error al registrar usuario: " + err);
                throw err;
              }
              console.log("Registro de usuario exitoso");
              return done(null, newUser);
            });
          }
        });
      }
    )
  );

  var createHash = function(password) {
    return bCrypt.hashSync(password, 10, null);
  };
};
