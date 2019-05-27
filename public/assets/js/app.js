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
        // had rendered it from the server
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

    // In jquery can we get a hold of the parent div?
    // and then clear it?
    // $(this).parent().parent().empty();
    let nth = $(this).data("number");
    $("#"+nth).empty();

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

  // listen to the button with the class="del-article-btn" for a click
  // then do a DELETE which will delete the article from the database
  // then remove the article from the displayed list.
  $(".del-article-btn").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    let id = $(this).data("id");
    console.log("HEATHER IN DELETE not empty id " + id );    

    $.ajax("/api/article/"+id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted article");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
  
  // listen for a click on the save-note-btn. Then
  // get the text from the input and call a post method
  $("#save-note-btn").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    let note = $("#message-text").val();
    let id = $("#noteModal").data("articleid");

    $.ajax("/api/note/"+id, {
      type: "POST", 
      data: {body: note}
    }).then(
      function() {
        console.log("saved note");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

// This is how we pass the articleID  to the modal
// This function will be called before open boostrap modal window. 
// We can get the data-id attribute value of the modal launch button and we can write it to the modal
  $('#noteModal').on('show.bs.modal', function(event) {
    var articleID = $(event.relatedTarget).data('id');
    console.log("HEATHER the articleID is " + articleID);
    $("#noteModal").attr("data-articleid", articleID);
  });
});