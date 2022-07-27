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

// we declared the Express function async to work with await. Hence at this point we can use await at Message.save() which will return a value once it finishes and will save into a variable called savedMessage.

app.post('/messages', async (req, res) => {
  var message = new Message(req.body);
  var savedMessage = await message.save();
  console.log('saved');
  var censoredMessage = await Message.findOne({ message: 'badWord' });
  if (censoredMessage) {
    console.log('Badword Found, sent by:', censoredMessage.name);
    console.log('Badword Deleted');
    return Message.deleteMany({ _id: censoredMessage.id });
  } else {
    io.emit('message', req.body);
    res.sendStatus(200);
  }
});

// -------------------------Below is synchronous code converted from asynchronous code using promises.-------------------------

// app.post('/messages', (req, res) => {
//   var message = new Message(req.body);

//   message
//     .save()
//     .then(() => {
//       console.log('saved');
//       return Message.findOne({ message: 'badWord' });
//     })
//     .then((censoredMessage) => {
//       if (censoredMessage) {
//         console.log('Badword Found, sent by:', censoredMessage.name);
//         console.log('Badword Deleted');
//         return Message.deleteMany({ _id: censoredMessage.id });
//       }
//       io.emit('message', req.body);
//       res.sendStatus(200);
//     })
//     .catch((err) => {
//       console.log('Error Occured:', err);
//       res.sendStatus(500);
//     });
// });
// -------------------------Below is asynchronous code with nested callbacks and we have converted this to use promises.-------------------------
// app.post('/messages', (req, res) => {
//   var message = new Message(req.body);
//   message.save((err) => {
//     if (err) sendStatus(500);

//     // Nested Callback to remove badword
//     Message.findOne({ message: 'badWord' }, (err, censoredMessage) => {
//       //callback returns the data object which contains the word that we are finding (in this case "badword")
//       if (!!censoredMessage) {
//         console.log('censored word found', censoredMessage);
//         Message.remove({ _id: censoredMessage.id }, (err) => {
//           // Even though we don't have id as part of our model but still we have id in our every object because mongoose creates and manages id for us anytime we save an object to our collection(Database)
//           console.log('removed censored message');
//         });
//       }
//     });

//     io.emit('message', req.body);
//     res.sendStatus(200);
//   });
// });

io.on('connection', (socket) => {
  console.log('a user connected');
});

var server = http.listen(4000, () => {
  console.log('Server is listening on port', server.address().port);
});
