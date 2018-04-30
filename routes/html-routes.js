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
    });

    // Route for grabbing a specific Article by id, populate it with it's notes
    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (result) {
                var noteObj = {
                    note: result.note
                }
                console.log(noteObj);
                res.render("home", noteObj);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (result) {
                var noteObj = {
                    note: result
                }
                res.render("home", noteObj);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
}