var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket: SocketIO.Socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg: string) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});