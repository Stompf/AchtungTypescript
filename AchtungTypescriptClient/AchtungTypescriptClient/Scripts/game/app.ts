import socketIO = require('socket.io-client');
import ClientGame = require('./ClientGame');
import ClientPlayer = require('./ClientPlayer');
import KeyboardStates = require('./KeyboardStates');
import localGameVariables = require('./LocalGameVariables');

class AchtungTypescript {
    canvasElement: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    socket: SocketIOClient.Socket;
    currentGame: ClientGame;

    constructor(canvas: HTMLCanvasElement) {
        this.canvasElement = canvas;
        this.ctx = canvas.getContext('2d');
    }

    startNetwork() {
        this.socket = socketIO('http://localhost:3000');

        this.socket.on('chat message', (msg: string) => {
            alert('chat message: ' + msg);
        });
    }

    startLocal() {
        const localPlayers = [new ClientPlayer('local_1', 'blue', localGameVariables.playerSpeed, localGameVariables.playerSize, <ClientTypings.KeyboardKeys>{ left: KeyboardStates.A, right: KeyboardStates.S })];//,
            //new ClientPlayer('local_2', 'red', localGameVariables.playerSpeed, localGameVariables.playerSize, <ClientTypings.KeyboardKeys>{ left: KeyboardStates.ArrowLeft, right: KeyboardStates.ArrowRight })];

        this.currentGame = new ClientGame(this.ctx, localPlayers, localGameVariables);

        localPlayers.forEach(player => {
            const x = Math.floor((Math.random() * this.currentGame.map.size.width) + 1);
            const y = Math.floor((Math.random() * this.currentGame.map.size.height) + 1);
            player.position(<CommonTypings.Vector2D>{
                x: x,
                y: y
            });
        });

        this.currentGame.startGame();
    }

} export = AchtungTypescript;