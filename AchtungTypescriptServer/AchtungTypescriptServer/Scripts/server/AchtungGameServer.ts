import collections = require('../collections');
import ServerPlayer = require('./ServerPlayer');

class AchtungServer {

    id: string;
    players: collections.Dictionary<string, ServerPlayer>;

    constructor(id: string, playerSockets: Array<SocketIO.Socket>) {
        this.players = new collections.Dictionary<string, ServerPlayer>();
        this.id = id;

        playerSockets.forEach(playerSocket => {
            this.players.setValue(playerSocket.id, new ServerPlayer(playerSocket));
        });
    }

    initServer() {
        
    }

}
export = AchtungServer;