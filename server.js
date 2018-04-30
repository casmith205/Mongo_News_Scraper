var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

// Require all models
var db = require("./models");

var PORT = 8080;

// Initialize Express
var app = express();

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/MongoScraper");

// api routes
// require("./routes/api-routes.js")(app)

// Routes
// ---------------------------------------------
app.get("/scrape", function (req, res) {
  request("https://www.npr.org/sections/music-news/", function (error, response, html) {
    var $ = cheerio.load(response.data);
    $(".item has-image").each(function (i, element) {
      var result = {}
      console.log($(this));
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      // result.summary = $(this)
      // result.image = $(this)

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          return res.json(err);
        });
    });
    res.send("Data scraped");
  });
// });

// // Route for getting all Articles from the db
// app.get("/articles", function (req, res) {
//   db.Article.find({})
//     .then(function (dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function (err) {
//       res.json(err);
//     });
// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function (req, res) {
//   db.Article.findOne({ _id: req.params.id })
//     .populate("note")
//     .then(function (dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function (err) {
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function (req, res) {
//   db.Note.create(req.body)
//     .then(function (dbNote) {
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function (dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function (err) {
//       res.json(err);
//     });
// });

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});
