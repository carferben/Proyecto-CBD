var express = require("express");
var passport = require("passport");
var path = require("path");
var homeRouter = require("./src/routers/homeRouter");
var usuarioRouter = require("./src/routers/usuarioRouter")(passport);
var tiendaRouter = require("./src/routers/tiendaRouter");
var categoriaRouter = require("./src/routers/categoriaRouter");
var subcategoriaRouter = require("./src/routers/subcategoriaRouter");
var bodyParser = require("body-parser");
var session = require("express-session");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var Usuario = require("./src/models/usuario");
require("dotenv").config();

// Conectamos la base de datos
var db = require("./db");
db.connectDB();

// Iniciamos la aplicación
var app = express();

// Archivos estáticos
app.use(express.static(__dirname + "/public"));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
  })
);

// Initialize Passport
var initPassport = require("./src/passport/init");
initPassport(passport);

app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
app.use(flash());

app.use(function(req, res, next) {
  user = new Usuario();
  if (req.user) user = req.user;
  res.locals.user = user;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Cargamos el motor de vista
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "pug");

// Routes
app.use("/", homeRouter);
app.use("/usuario", usuarioRouter);
app.use("/tienda", tiendaRouter);
app.use("/categoria", categoriaRouter);
app.use("/subcategoria", subcategoriaRouter);

// Iniciamos el servidor
const port = 3000;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
