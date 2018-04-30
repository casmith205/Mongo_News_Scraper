// Require all models
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

    //display home page on inital load
    app.get("/", function (req, res) {
        db.Article.find({})
        .then(function (result) {
            var articleObj = {
                    article: result
                }
            res.render("home", articleObj);
        })
        .catch(function (err) {
            res.json(err);
        });
    })
}