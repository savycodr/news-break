# news-break
Displays the local news and provides a means for users to write comments. This app gets its news from nhl.com.

## Instructions
1. Visit the [News Break](https://enigmatic-crag-82281.herokuapp.com/) website. 
2. Select Load Articles button.
3. Select an Article you wish to save.
4. Add a note to the Article.

## Technology
* This app uses a Mongo database to persist the Article and Note data.
* The server uses Handlebars templates to present the data to the client. 
* The server uses  Mongoose for Object Relational Mapping.
* The server uses Cheerio and Axios to load and scrape the articles on nhl.com
* The server is deployed on Heroku.
* The HTML uses Bootstrap CSS libraries.
* The client uses JQuery libraries to assist with making requests to the server and handling the response.
* The server uses the Express Node package to handle server-side listening and handling requests from the client.
