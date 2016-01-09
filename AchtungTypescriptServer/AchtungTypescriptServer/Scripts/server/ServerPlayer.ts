class ServerPlayer {

    socket: SocketIO.Socket;

    constructor(socket: SocketIO.Socket) {
        this.socket = socket;
    }

}
export = ServerPlayer;