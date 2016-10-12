var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

import collection = require('./Scripts/collections');
import Matchmaking = require('./Scripts/server/Matchmaking');

const connections = new collection.Dictionary<string, SocketIO.Socket>();
const matchmaking = new Matchmaking();
const port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
//const ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

http.listen(port, () => {
    console.log('listening on *:' + port);
});

io.on('connection', (socket: SocketIO.Socket) => {
    connections.setValue(socket.id, socket);
    console.log('a user connected with id: ' + socket.id);
    matchmaking.addNewConnection(socket);

    socket.on('disconnect', () => {
        matchmaking.removeConnection(socket);
        connections.remove(socket.id);
        console.log(socket.id + ' - user disconnected');
    });

    socket.on('chat message', (msg: string) => {
        console.log(socket.id + ' - message: ' + msg);
        io.emit('chat message', msg);
    });
});