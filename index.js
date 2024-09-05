const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT
const path = require('path');
const http = require('http');
app.use(express.static('./public'))


const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => { 
    console.log("User connected:", socket.id);

    socket.on("send-route", (data) => {
        socket.broadcast.emit('receive-route', data);
    });

    socket.on("update-car-position", (data) => {
        socket.broadcast.emit('update-car-on-map', data);
    });

    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
    });
});

// EJS connection
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

// Server listen
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
