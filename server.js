const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const http = require('http');
require('dotenv').config()


//socket connection:
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send location", (data) => {
        socket.broadcast.emit('receive-location', { id: socket.id, ...data });
    });   

    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
        io.emit('user-disconnected', socket.id);
    });
});

//Ejs connection:
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

//server listen:
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

