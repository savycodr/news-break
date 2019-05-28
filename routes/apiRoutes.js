
module.exports = function (app) {

  // Our scraping tools
  // Axios is a promised-based http library, similar to jQuery's Ajax method
  // It works on the client and on the server
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
      console.log(results);
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
        res.render("saved", { articles: dbArticle });
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

  });

  // Here we delete an article from the database
  // HLS this does not delete any notes associated with this database
  app.delete("/api/article/:id", function (req, res) {

    let id = req.params.id;

    // Delete the article in the Articles collection
    db.Article.remove({ "_id": id })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

  });

  // Save the note passed in, to the database and join with the article
  app.post("/api/note/:articleid", function (req, res) {

    db.Note.create(req.body).then(function (dbNote) {
      // note has been created in the database but we need to join it with the article
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query

      // return db.Article.findOneAndUpdate({ _id: req.params.articleid }, { note: dbNote._id }, { new: true });
      return db.Article.findOneAndUpdate({ _id: req.params.articleid }, { $push: { notes: dbNote._id } }, { new: true });
    })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        console.log("HEATHER HERE IS THE ARTICLE WITH NEW NOTE");
        console.log(JSON.stringify(dbArticle));
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

  });

  // Get all the notes for an article
  // a poplulate is like a join.
  // we join all the notes attached to the article
  app.get("/api/notes/:articleid", function (req, res) {

    console.log("we made it to a place to get notes " + req.params.articleid);


    db.Article.findOne({ _id: req.params.articleid })
      .populate("notes")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        // res.render('saved',{openloginmodal:"yes", article:dbArticle});
        console.log("Heather we are about to show you the money.");
        console.log(JSON.stringify(dbArticle))
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);

      })
  });

  // Delete the note
  // HLS This does not remove the note reference from the Article
  app.delete("/api/notes/:noteid", function (req, res) {
    console.log("Here is the id we are deleting: " + req.params.noteid);
    db.Note.findOneAndRemove({ _id: req.params.noteid })
      .then(function (dbNote) {

        //HLS 
        // find the Article and remove the note from the article
        return db.Article.findOneAndUpdate({ _id: req.body.id }, { $pop: { notes: req.params.noteid } }, { new: true })
          .then(function (dbArticle) {

            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });
  });
}