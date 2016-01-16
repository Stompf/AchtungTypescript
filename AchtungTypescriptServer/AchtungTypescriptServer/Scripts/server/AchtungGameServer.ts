import collections = require('../collections');
import ServerPlayer = require('./ServerPlayer');
import ServerMap = require('./ServerMap');

class AchtungServer {

    id: string;
    players: collections.Dictionary<string, ServerPlayer>;
    map: ServerMap;
    colors: Array<string> = ['blue', 'red', 'black', 'yellow', 'cyan'];

    constructor(id: string, playerSockets: Array<SocketIO.Socket>) {
        this.players = new collections.Dictionary<string, ServerPlayer>();
        this.id = id;

        this.map = new ServerMap();

        playerSockets.forEach((playerSocket, index) => {
            this.players.setValue(playerSocket.id, new ServerPlayer(playerSocket, this.colors[index], this.map.getRandomPosition(30), this.getRandomDirection()));
        });
    }

    initServer() {
        
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