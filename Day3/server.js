var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var dbUrl = 'mongodb+srv://user:user@learning-node.4recu.mongodb.net/?retryWrites=true&w=majority';

var Message = mongoose.model('Message', { name: String, message: String });

mongoose.connect(dbUrl, (err) => {
  console.log('mongoDB Connection Error:', err);
});

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if (err) sendStatus(500);

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
