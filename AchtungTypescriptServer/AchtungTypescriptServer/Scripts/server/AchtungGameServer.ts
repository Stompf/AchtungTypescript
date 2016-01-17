import collections = require('../collections');
import ServerPlayer = require('./ServerPlayer');
import ServerMap = require('./ServerMap');
import serverGameVariables = require('./ServerGameVariables');

class AchtungServer {

    id: string;
    players: collections.Dictionary<string, ServerPlayer>;
    playerSockets: collections.Dictionary<string, SocketIO.Socket>;
    map: ServerMap;
    colors: Array<string> = ['blue', 'red', 'black', 'yellow', 'cyan'];
    tick: number;
    interval: NodeJS.Timer;

    constructor(id: string, playerSockets: Array<SocketIO.Socket>) {
        this.players = new collections.Dictionary<string, ServerPlayer>();
        this.playerSockets = new collections.Dictionary<string, SocketIO.Socket>();
        this.id = id;
        this.tick = 0;
        this.map = new ServerMap();

        playerSockets.forEach((playerSocket, index) => {
            this.playerSockets.setValue(playerSocket.id, playerSocket);
            this.players.setValue(playerSocket.id, new ServerPlayer(playerSocket.id, this.colors[index], this.map.getRandomPosition(100), this.getRandomDirection()));
            this.initPlayerSocketEvents(playerSocket);
        });
    }

    startServer() {
        this.playerSockets.values().forEach(playerSocket => {
            playerSocket.emit('StartGame', <AchtungCommunication.StartGame>{
                timeToStart: new Date(),
                mapBox: this.map.mapBox.values()
            });
        });

        this.interval = setInterval(() => {
            this.tick++;

            this.players.values().forEach(player => {
                this.map.movePlayer(player);
            });

            const gameOver = this.players.values().filter(player => {
                return player.isAlive;
            });

            if (gameOver.length <= 1) {
                clearTimeout(this.interval);
                this.playerSockets.values().forEach(playerSocket => {
                    playerSocket.emit('GameOver', <AchtungCommunication.GameOver>{
                        mapBox: this.map.mapBox.values(),
                        winner: gameOver.length === 1 ? gameOver[0] : null
                    });
                });
            } else {
                this.playerSockets.values().forEach(playerSocket => {
                    playerSocket.emit('ServerTick', <AchtungCommunication.ServerTick>{
                        tick: this.tick,
                        mapBox: this.map.mapBox.values()
                    });
                });
            }
        }, serverGameVariables.tickLength);
    }

    private initPlayerSocketEvents(playerSocket: SocketIO.Socket) {
        playerSocket.on('PlayerReady', (obj: AchtungCommunication.PlayerReady) => {
            this.players.getValue(playerSocket.id).ready = true;
            this.checkIfAllReady();
        });

        playerSocket.on('NewDirection', (obj: AchtungCommunication.NewDirection) => {
            this.players.getValue(playerSocket.id).changeDirection(obj.direction);
        });
    }

    private checkIfAllReady() {
        const allReady = this.players.values().every(player => {
            return player.ready;
        });

        if (allReady) {
            this.startServer();
        }
    }

    private getRandomDirection() {
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                return CommonTypings.Direction.UP;
            case 1:
                return CommonTypings.Direction.DOWN;
            case 2:
                return CommonTypings.Direction.RIGHT;
            case 3:
                return CommonTypings.Direction.LEFT;
            default:
                return CommonTypings.Direction.UP;
        }
    }

}
export = AchtungServer;