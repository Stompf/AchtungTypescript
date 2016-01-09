import socketIO = require('socket.io-client');

class AchtungTypescript {
    canvasElement: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    socket: SocketIOClient.Socket;

    constructor(canvas: HTMLCanvasElement) {
        this.canvasElement = canvas;
        this.ctx = canvas.getContext('2d');
    }

    start() {
        this.socket = socketIO('http://localhost:3000');

        this.socket.on('chat message', (msg: string) => {
            alert('chat message: ' + msg);
        });
    }
} export = AchtungTypescript;