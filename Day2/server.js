var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose'); // After referencing mongoose in a variable, we will connect DB and for that we will need the connection string available on cloud.mongodb.com.

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// We copied the connection string (URL/URI) of the we want to connect and which is present on cloud.mongodb.com.
// After pasting the URI, we put in the user credentials by changing the part of the URI string from "<password>" to the password we earlier set for the DB on the cloud (in this case "user").
// In a production environment , we would want to keep this URL, especially the credentials, hidden in a configuration file that has a safe location.
// Now we will connect to mongoose as below.
var dbUrl = 'mongodb+srv://user:user@learning-node.4recu.mongodb.net/?retryWrites=true&w=majority';

// Setting Up initial structure
// Structure we setup is a mongoose model and a schema for a message object.
// First parameter specifies, what we call it. Second parameter takes in the schema definition which is an object with the properties
var Message = mongoose.model('Message', { name: String, message: String });
// We have defined model, further we will define object based on the model.

// removed messages array as we will no longer use the array because now we are directly saving the message in MongoDB using "Message.save()" and we will retrieve messages directly from DB using "Message.find()"
// var messages = [
//   { name: 'Chinmaya', message: 'How are you?' },
//   { name: 'Professor X', message: 'I am good, what about you?' },
// ];

// Connecting to mongoDB
// We supply dbURL(connection string that has auth credentials and reference to DB we created on cloud) as first parameter and callback function as second parameter
// With mongoose 5 & above we don't need to provide useMongoClient option. Mongoose 5 is using Mongo client by default.
mongoose.connect(dbUrl, (err) => {
  console.log('mongoDB Connection Error:', err);
});

app.get('/messages', (req, res) => {
  // First parameter contains requirements data that is be used to filter out data. Since, we don't have any requirements we will pass empty object.
  // Second parameter is a callback function that takes in an error and all of the data it finds.
  // We will then send the response(data) that we find in the DB
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post('/messages', (req, res) => {
  var message = new Message(req.body); // we created "message" object based on "Message" mongoose model.

  // message.save() will save the messages in the DB and only then it will show new messages. If save fails then it will sendStatus 500
  message.save((err) => {
    if (err) sendStatus(500);

    // removed messages array as we will no longer use the array because now we are directly saving the message in MongoDB using "Message.save()" and we will retrieve messages directly from DB using "Message.find()"
    // messages.push(req.body);
    io.emit('message', req.body);
    res.sendStatus(200);
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

var server = http.listen(4000, () => {
  console.log('Server is listening on port', server.address().port);
});
