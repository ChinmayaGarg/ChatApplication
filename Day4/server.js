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

app.post('/messages', async (req, res) => {
  try {
    var message = new Message(req.body);
    var savedMessage = await message.save();
    console.log('saved');
    var censoredMessage = await Message.findOne({ message: 'badWord' });
    if (censoredMessage) {
      console.log('Badword Found, sent by:', censoredMessage.name);
      console.log('Badword Deleted');
      return Message.deleteMany({ _id: censoredMessage.id });
    } else io.emit('message', req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.log(error);
  } finally {
    //logger.log('message post called')
    console.log('message post called');
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

var server = http.listen(4000, () => {
  console.log('Server is listening on port', server.address().port);
});
