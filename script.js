const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app)
const host = 'http://localhost:3000/';

const { Server } = require("socket.io");
const io = new Server(server);

const users = {}

app.get('/',(req, res) =>{
    res.sendFile(__dirname+ '/index.html');
});

io.on('connection', (socket) => {
    console.log('New user has been connected!');
    socket.on('user-login',(name)=>{
        users[socket.id] = name
        socket.broadcast.emit('new-user-connected', name);
    })

    socket.on('disconnect', () => {
        console.log('An user has been disconnected');
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    });
    socket.on('chat-msg', (data) => {
        io.emit('chat-msg', data);
    });

    socket.on('check-typing', (user)=>{
        users[socket.id] = user
        socket.broadcast.emit('user-typing', user);
    })

    socket.on('non-typing',()=>{
        socket.broadcast.emit('non-user-typing')
    })
});

server.listen(3000, ()=>{
    console.log('server chat is running in ' + host);
})

