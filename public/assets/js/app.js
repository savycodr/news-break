/* eslint-disable linebreak-style */
// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {

  // listen to the form with the class="add-burger" for a submit button
  // then do a POST which will insert the new burger into the database
  $(".add-article").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    console.log("THE SUBMIT HAS BEEN HIT");

    $.ajax("/api/articles", {
      type: "POST",
      data: article
    }).then(
      function() {
        console.log("created new article");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

});