const express = require("express");
const Article = require("../models/article");

const router = express.Router();
// Añadir artículo
router.get("/list", (req, res) => {
    Article.find({}, (err, articles) => {
        if (err){
            console.error(err);
        }else{
            res.render("listArticle", {
                title: "Lista de artículos",
                articles: articles
            });
        }
    });
});

// Añadir artículo
router.get("/add", (req, res) => {
    res.render("addArticle", {
        title: "Añadir Artículo"
    });
});

module.exports = router;