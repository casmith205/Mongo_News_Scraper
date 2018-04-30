var express = require("express");
var exphbs = require("express-handlebars")
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

// Require all models
var db = require("./models");

// Defining the port
var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// parse application/json
app.use(bodyParser.json());

// using the handlebars views
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/MongoScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


//Routes
require("./routes/html-routes.js")(app)

// Routes
// ---------------------------------------------
app.get("/scrape", function (req, res) {
  request("https://www.npr.org/sections/music-news/", function (error, response, html) {
    var $ = cheerio.load(html);

    $(".item").each(function (i, element) {
      var result = {}

      result.title = $(this)
        .find("h2 a")
        .text()
      result.link = $(this)
        .find("p a")
        .attr("href");
      result.summary = $(this)
        .find("p a")
        .text();
      result.image = $(this)
        .find("img")
        .attr("src");

      console.log(result);
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
});


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});
