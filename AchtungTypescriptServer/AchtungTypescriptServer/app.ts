var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

import collection = require('./Scripts/collections');

http.listen(3000, () => {
    console.log('listening on *:3000');
});

const connections = new collection.Dictionary<string, SocketIO.Socket>();

io.on('connection', (socket: SocketIO.Socket) => {
    connections.setValue(socket.id, socket);
    console.log('a user connected with id: ' + socket.id);

    socket.on('disconnect', () => {
        connections.remove(socket.id);
        console.log(socket.id + ' - user disconnected');
    });

    socket.on('chat message', (msg: string) => {
        console.log(socket.id + ' - message: ' + msg);
        io.emit('chat message', msg);
    });
});