var express = require('express');
var morgan = require('morgan');
// const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const key = fs.readFileSync('key.pem');
const cert = fs.readFileSync('cert.pem');
const https = require('https');
const randomstring = require('randomstring');

var app = express();
const server = https.createServer({key: key, cert: cert}, app,);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let hidden = false;
let model = 0;

// app.use(cors());
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', (socket) => {
    console.log(`Client ${socket.id} connected`);

    socket.join(socket.handshake.query);

    socket.on('slideEvent', (code,state) => {
        console.log("Change state requested from: " + code + " [" + state + "]");
        if (state === "next")
        {
            model++;
        }
        else if (state === "previous")
        {
            model--;
        }
        socket.broadcast.emit("slideEvent",model);
    });

    socket.on('modelHide', (code,state) => {
        hidden = !hidden;
        console.log("Hide Model requested from: " + code + " [" + state + "]");
        socket.broadcast.emit("modelHide",hidden);
    });
    // socket.on('createRoom', msg => {
    //     console.log("Created Room");
    //     let accessCode = randomstring.generate({
    //         length: 4,
    //         charset: 'alphabetic',
    //         capitalization: 'uppercase',
    //         readable: 'true'
    //     })
    //     socket.emit('createRoom', accessCode);
    //     socket.join(accessCode);
    // });

    socket.on('joinRoom', accessCode => {
        console.log("Join Room");
        socket.join(accessCode);
        socket.emit("Success");
    });
});

server.listen(4000, () => {
    console.log('listening on PORT:4000');
});

// if (!module.parent) {
//   app.listen(4000);
//   console.log('Express started on port 4000');
// }