import collections = require('../collections');

class AchtungServer {

    id: string;
    players: Array<SocketIO.Socket>;

    constructor(id: string, players: Array<SocketIO.Socket>) {
        this.players = players;
        this.id = id;
    }

    initServer() {
        
    }

}
export = AchtungServer;