const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const homeRouter = require("./src/routers/homeRouter");
const tiendaRouter = require("./src/routers/tiendaRouter");
require("dotenv").config();
// Conectamos con la base de datos
mongoose.connect(
  "mongodb://" +
    process.env.DB_USER +
    ":" +
    process.env.DB_PASSWORD +
    "@" +
    process.env.DB_HOST +
    "/" +
    process.env.DB_NAME,
  { useCreateIndex: true, useNewUrlParser: true }
);
const db = mongoose.connection;

// Comprobamos la conexión
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Comprobamos si hay errores en la base de datos
db.on("error", err => {
  console.error(err);
});

// Iniciamos la aplicación
const app = express();

// Archivos estáticos
app.use(express.static(__dirname + "/public"));

// Cargamos el motor de vista
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "pug");

// Routes
app.use("/", homeRouter);
app.use("/tienda", tiendaRouter);

// Iniciamos el servidor
const port = 3000;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
