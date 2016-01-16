import collections = require('../collections');
import ServerPlayer = require('./ServerPlayer');
import ServerMap = require('./ServerMap');
import serverGameVariables = require('./ServerGameVariables');

class AchtungServer {

    id: string;
    players: collections.Dictionary<string, ServerPlayer>;
    map: ServerMap;
    colors: Array<string> = ['blue', 'red', 'black', 'yellow', 'cyan'];
    tick: number;
    timeoutReference: NodeJS.Timer;

    constructor(id: string, playerSockets: Array<SocketIO.Socket>) {
        this.players = new collections.Dictionary<string, ServerPlayer>();
        this.id = id;
        this.tick = 0;
        this.map = new ServerMap();

        playerSockets.forEach((playerSocket, index) => {
            this.players.setValue(playerSocket.id, new ServerPlayer(playerSocket, this.colors[index], this.map.getRandomPosition(30), this.getRandomDirection()));
            this.initPlayerSocketEvents(playerSocket);
        });
    }

    startServer() {
        this.players.values().forEach(player => {
            player.socket.emit('StartGame', <AchtungCommunication.StartGame>{
                timeToStart: new Date(),
                mapBox: this.map.mapBox.values()
            });
        });

        this.timeoutReference = setTimeout(() => {
            this.tick++;

            this.players.values().forEach(player => {
                this.map.movePlayer(player);
            });

            const gameOver = this.players.values().filter(player => {
                return player.isAlive;
            });

            if (gameOver.length <= 1) {
                clearTimeout(this.timeoutReference);
                this.players.values().forEach(player => {
                    player.socket.emit('GameOver', <AchtungCommunication.GameOver>{
                        mapBox: this.map.mapBox.values(),
                        winner: gameOver.length === 1 ? gameOver[0] : null
                    });
                });
            } else {
                this.players.values().forEach(player => {
                    player.socket.emit('ServerTick', <AchtungCommunication.ServerTick>{
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