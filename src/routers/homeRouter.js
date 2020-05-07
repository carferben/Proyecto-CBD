var express = require("express");
var router = express.Router();
const Tienda = require("../models/tienda");

router.get("/:page([0-9])*?", async (req, res) => {
  var search = req.query.search;
  if (!search) search = "";
  var page = req.params.page;
  if (!page || req.query.search == "") page = 0;
  var re = new RegExp(search, "i");
  var count;
  var tiendas;

  count = await Tienda.countDocuments({}).or([
    { nombre: { $regex: re } },
    { descripcion: { $regex: re } },
  ]);
  tiendas = await Tienda.find({})
    .or([{ nombre: { $regex: re } }, { descripcion: { $regex: re } }])
    .skip(4 * page)
    .limit(4);
  search = search == "" ? "" : "?search=" + search;
  return res.render("index", {
    tiendas: tiendas,
    page: page,
    totalItems: count,
    search: search,
  });
});

module.exports = router;
