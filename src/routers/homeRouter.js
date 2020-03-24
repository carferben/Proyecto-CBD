var express = require('express');
var router = express.Router();

// Añadir post
router.get("/", (req, res) => {
    res.render("index", {
        title: "Página Principal"
    });
});

module.exports = router;