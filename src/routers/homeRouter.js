var express = require("express");
var router = express.Router();
const Tienda = require("../models/tienda");

router.get("/", (req, res) => {
  Tienda.find({}, (err, tiendas) => {
    if (err) {
      console.error(err);
    } else {
      res.render("index", {
        tiendas: tiendas
      });
    }
  });
});

module.exports = router;
