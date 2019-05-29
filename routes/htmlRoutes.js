
module.exports = function (app) {

  // Set up the home page
  app.get("/", function (req, res) {
    // render the initial page
    var articles = [];
    res.render("index", {articles: articles});
  });

};
