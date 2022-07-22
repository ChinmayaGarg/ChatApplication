var express = require('express'); //
var app = express(); //we set reference to app variable from an instance of express

// https://www.geeksforgeeks.org/express-js-app-use-function/
//The app.use() function is used to mount the specified middleware function(s) at the path which is being specified. It is mostly used to set up middleware for your application.
//we will use app.use() to serve static content. We served index.html through app.use().
// In order to tell express that we will be serving a static file inside our app.use, we use express.static() and pass in the entire directory with _dirname.
app.use(express.static(__dirname));

// We created a route for endpoint. app.get() means we will be handling a GET request.
// First parameter is the route "localhost:3000/messages"
// Second parameter is the call back to handle the request. Takes in request and gives reference to response
app.get('/messages', (req, res) => {
  res.send('hello');
});

//starts the express service and listens for requests. It takes port number as first parameter
var server = app.listen(3000, () => {
  console.log('Server is listening on port 3000'); //Port Hardcoded

  //Taken reference of the actual port in case it changes once we deploy our app on a server
  console.log('Server is listening on port', server.address().port);
});
// We were able to access server because server got assigned by the value from app.listen first and then the call back function is called once the app.listen() finished running.
