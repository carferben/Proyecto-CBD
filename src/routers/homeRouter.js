var express = require("express");
var router = express.Router();
const Tienda = require("../models/tienda");

router.get("/:page([0-9]*)?", (req, res) => {
  page = req.params.page;
  if (!page) page = 0;
  Tienda.countDocuments({}, (err, count) => {
    if (err) {
      console.error(err);
      return;
    }
    Tienda.find({}, {}, { skip: 4 * page, limit: 4 }, (err, tiendas) => {
      if (err) {
        console.error(err);
        return;
      }
      res.render("index", {
        tiendas: tiendas,
        page: page,
        totalItems: count,
      });
    });
  });
});

module.exports = router;
