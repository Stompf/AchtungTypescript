﻿import collections = require('../collections');
import AchtungGameServer = require('./AchtungGameServer');

class Matchmaking {

    queuedConnections: collections.Dictionary<string, SocketIO.Socket>;
    currentGames: collections.Dictionary<string, AchtungGameServer>;
    socketStatus: collections.Dictionary<string, string>;

    constructor() {
        this.queuedConnections = new collections.Dictionary<string, SocketIO.Socket>();
        this.currentGames = new collections.Dictionary<string, AchtungGameServer>();
        this.socketStatus = new collections.Dictionary<string, string>();
    }

    addNewConnection(socket: SocketIO.Socket) {
        if (socket == null) {
            return;
        }
        this.queuedConnections.setValue(socket.id, socket);
        this.socketStatus.setValue(socket.id, null);
        this.handleQueuedConnectionChanged(socket);
    }

    removeConnection(socket: SocketIO.Socket) {
        if (socket == null) {
            return;
        }
        this.queuedConnections.remove(socket.id);
    }

    handleQueuedConnectionChanged(changedSocket: SocketIO.Socket) {
        if (this.queuedConnections.size() > 1) {
            this.startNewAchtungGame(changedSocket, this.queuedConnections.values()[1]);
        }
    }

    startNewAchtungGame(socket1: SocketIO.Socket, socket2: SocketIO.Socket) {
        this.queuedConnections.remove(socket1.id);
        this.queuedConnections.remove(socket2.id);

        const gameID = this.createAchtungGameServerId([socket1, socket2].map(socket => { return socket.id; }));
        const newGame = new AchtungGameServer(gameID, [socket1, socket2]);

        this.socketStatus.setValue(socket1.id, gameID);
        this.socketStatus.setValue(socket2.id, gameID);

    }

    createAchtungGameServerId(ids: Array<string>) {
        if (ids == null) {
            return null;
        } else {
            let gameId = '';
            let idInstance = 0;
            while (gameId === '' || this.currentGames.containsKey(gameId)) {
                gameId = ids.join('_') + '_' + idInstance;
                idInstance++;
            } 
            return gameId;
        }
    }
}
export = Matchmaking;