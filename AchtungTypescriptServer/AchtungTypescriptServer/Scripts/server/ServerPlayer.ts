class ServerPlayer implements CommonTypings.Player {
    id: string;
    color: string;
    position: CommonTypings.Vector2D;
    isAlive: boolean;
    direction: CommonTypings.Direction;

    lastDirectionChanged: number;
    waitTime: number = 500;

    ready: boolean;

    constructor(id: string, color: string, startPosition: CommonTypings.Vector2D, startDirection: CommonTypings.Direction) {
        this.id = id;
        this.color = color;
        this.isAlive = true;
        this.position = startPosition;
        this.direction = startDirection;
    }

    changeDirection(direction: CommonTypings.Direction) {
        const now = new Date().getTime();

        if ((now + this.waitTime) < this.lastDirectionChanged) {
            return;
        }     

        if (direction === CommonTypings.Direction.UP && this.direction !== CommonTypings.Direction.DOWN) {
            this.direction = CommonTypings.Direction.UP;
        } else if (direction === CommonTypings.Direction.DOWN && this.direction !== CommonTypings.Direction.UP) {
            this.direction = CommonTypings.Direction.DOWN;
        } else if (direction === CommonTypings.Direction.LEFT && this.direction !== CommonTypings.Direction.RIGHT) {
            this.direction = CommonTypings.Direction.LEFT;
        } else if (direction === CommonTypings.Direction.RIGHT && this.direction !== CommonTypings.Direction.LEFT) {
            this.direction = CommonTypings.Direction.RIGHT;
        }

        this.lastDirectionChanged = now;
    }
}
export = ServerPlayer;