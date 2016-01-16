class ServerPlayer implements CommonTypings.Player {

    socket: SocketIO.Socket;
    id: string;
    color: string;
    position: CommonTypings.Vector2D;
    isAlive: boolean;
    direction: CommonTypings.Direction;

    constructor(socket: SocketIO.Socket, color: string, startPosition: CommonTypings.Vector2D, startDirection: CommonTypings.Direction) {
        this.socket = socket;
        this.id = socket.id;
        this.color = color;
        this.isAlive = true;
        this.position = startPosition;
        this.direction = startDirection;
    }

}
export = ServerPlayer;