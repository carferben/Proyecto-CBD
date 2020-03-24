const mongoose = require("mongoose");

// Esquéma de artículo
const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

const Article = module.exports = mongoose.model("Article", articleSchema);