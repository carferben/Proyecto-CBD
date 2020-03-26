const mongoose = require("mongoose");

// Conectamos con la base de datos
module.exports.connectDB = function() {
  mongoose.connect(
    "mongodb://" +
      process.env.DB_USER +
      ":" +
      process.env.DB_PASSWORD +
      "@" +
      process.env.DB_HOST +
      "/" +
      process.env.DB_NAME,
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
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
};
