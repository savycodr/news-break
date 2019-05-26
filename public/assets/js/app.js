// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {

  // listen to the button with the id="load-stories-btn" for a click
  // then do a GET which will retrieve the twenty articles
  $("#load-stories-btn").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    console.log("THE SUBMIT HAS BEEN HIT");

    $.ajax("/api/articles", {
      type: "GET"
    }).then(
      function() {
        console.log("retrived 20 articles");
        // Reload the page to get the updated list
        // HLS didn't want to reload because was hoping handlebars
        // had rendered it from teh server
        // location.reload();
      }
    );
  });

  // listen to the button with the class="save-article-btn" for a click
  // then do a POST which will write the article to the database
  // then remove the article from the displayed list so it cannot be saved again.
  $(".save-article-btn").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    let title = $(this).data("title");
    let link = $(this).data("link");
    let summary = $(this).data("summary");
    console.log("HEATHER not empty title " + title + " " + link + " " + summary);

    let article = {
      title: title,
      link: link,
      summary: summary
    };
    

    $.ajax("/api/article", {
      type: "POST",
      data: article
    }).then(
      function() {
        console.log("saved article");
        // Reload the page to get the updated list
        location.reload();
      }
    );


  });
  

});