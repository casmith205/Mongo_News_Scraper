// Require all models
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

    //display home page on inital load
    app.get("/", function (req, res) {
        db.Article.find({})
        .then(function (article) {
            res.render("home");
        })
        .catch(function (err) {
            res.json(err);
        });
    })
}