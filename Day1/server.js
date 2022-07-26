var express = require('express'); //
var bodyParser = require('body-parser');
var app = express(); //we set reference to app variable from an instance of express
var http = require('http').Server(app); // we are adding http server, for it we called http library from Node and then we called .Server and then we pass our express app in it
var io = require('socket.io')(http); //  We created io and passed reference of http

// https://www.geeksforgeeks.org/express-js-app-use-function/
//The app.use() function is used to mount the specified middleware function(s) at the path which is being specified. It is mostly used to set up middleware for your application.
//we will use app.use() to serve static content. We served index.html through app.use().
// In order to tell express that we will be serving a static file inside our app.use, we use express.static() and pass in the entire directory with _dirname.
app.use(express.static(__dirname));

// We have set body-parser as a middleware using app.use().
// .JSON in bodyParser.JSON lets body-parser know, we expect JSON to be coming in with our HTTP request.
app.use(bodyParser.json());

// the mesages which will be displayed on frontend will be undefined because what comes in from our browser(Front-end) is URL encoded and hence we must set up the body-parser to support URL encoded data.
app.use(bodyParser.urlencoded({ extended: false }));

var messages = [
  { name: 'Chinmaya', message: 'How are you?' },
  { name: 'Professor X', message: 'I am good, what about you?' },
];

// We created a route for endpoint. app.get() means we will be handling a GET request.
// First parameter is the route. Check "localhost:3000/messages" on browser
// Second parameter is the call back to handle the request. Takes in request and gives reference to response
app.get('/messages', (req, res) => {
  // res.send('hello'); // Static string
  res.send(messages); // We updated static string to render a static object
});

// We created a route for endpoint. app.post() means we will be handling a POST request.
// added status 200 ok to send when a POST request sends data to localhost:3000/messages
// sendStatus is necessary for POST request to work fine...comment out res.sendStatus(200) and any POST request on localhost:3000/messages sent will not work
app.post('/messages', (req, res) => {
  // This console.log renders undefined on the console because express has no built in support to parse the body. Hence, we need to install package, named "body-parser" using "npm install -s body-parser"
  console.log(req.body);
  messages.push(req.body);
  io.emit('message', req.body); // Emitting the event named message. Event name can be anything we want. It tells this is the name of the event I will emit and you can listen this on front-end.
  res.sendStatus(200);
});

// Seting up a callback for the socket connection event that will let us know whenever a new user connects.
io.on('connection', (socket) => {
  console.log('a user connected');
});

//starts the express service and listens for requests. It takes port number as first parameter
var server = http.listen(3000, () => {
  //changed from app.listen to http.listen, so that the server can be changed from Express server to Node HTTP server and it will help front-end to serve back-end with socket.io and it will no longer give any error
  console.log('Server is listening on port 3000'); //Port Hardcoded

  //Taken reference of the actual port in case it changes once we deploy our app on a server
  console.log('Server is listening on port', server.address().port);
});
// We were able to access server because server got assigned by the value from app.listen first and then the call back function is called once the app.listen() finished running.
