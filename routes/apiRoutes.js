
module.exports = function (app) {

  // Need cheerio for the web scraping
  var cheerio = require("cheerio");
  // need axios to retreive the website to be scraped
  var axios = require("axios");

  // Requiring our models
  var db = require("../models");

  // Scrape news site for articles and return to client
  app.get("/api/articles", function (req, res) {

    console.log("We got inside the get api call");

    // we need to scrape the website for the articles
    // Making a request via axios for time's "entertainment" board. The page's Response is passed as our promise argument.
    axios.get("https://www.nhl.com/").then(function (response) {

      // Load the Response into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(response.data);

      // An empty array to save the data that we'll scrape
      var results = [];

      // With cheerio, find each h4-tag with the "headline-link" class
      // (i: iterator. element: the current element)
      $("h4.headline-link").each(function (i, element) {

        // Save the text of the h4-tag as "title"
        var title = $(element).text();
        // console.log("the title is " + title);

        // the summary is in the next tag
        var summary = $(element).next().text();
        // console.log("the summary is " + summary);

        // The Url is in the parent
        var link = $(element).parent().attr("href");
        // console.log("the link is " + link);
        // console.log("the i is " + i);

        // push into results array
        results.push({
          title: title,
          summary: summary,
          link: link
        });

        // To break out of the each loop early, return with false.
        // we only want 20 articles and iterator starts with 0
        if (i === 4) {
          return false;
        }
      });
      console.log("here are our results1");
      console.log(results);
      console.log("we are going to render index");
      // we need to build a handlebars response with the article data
      // HLS why does this call a GET /api/articles
      res.render("index", { articles: results });
    });
  });

  // Save the article passed in, to the database
  app.post("/api/article", function (req, res) {


    console.log("HEATHER The req.body is " + JSON.stringify(req.body));
    // Create a new Article using the `result` object built from scraping
    db.Article.create(req.body)
      .then(function (dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, log it
        console.log(err);
      });
    // Send a message to the client
    res.send("Save Complete");
  });

  // Here we get all the saved articles from the database
  app.get("/api/savedArticles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        // res.json(dbArticle);
        res.render("saved", {articles : dbArticle});
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

  });


};
