var express = require('express');
var morgan = require('morgan');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');


var app = express();
const server = require('http').Server(app);
const io = socketio(server);

const logger = (req, res, next) => {
    console.log('hit');
    next();
};

app.use(logger);
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', msg => {console.log(msg)})
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// if (!module.parent) {
//   app.listen(4000);
//   console.log('Express started on port 4000');
// }