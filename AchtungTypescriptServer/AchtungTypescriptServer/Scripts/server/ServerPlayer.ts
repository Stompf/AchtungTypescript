class ServerPlayer implements CommonTypings.Player {
    id: string;
    color: string;
    position: CommonTypings.Vector2D;
    isAlive: boolean;
    holeState: boolean;
    lastHoleEnd: Date;
    direction: CommonTypings.Direction;

    lastDirectionChanged: number;
    waitTime: number = 500;

    ready: boolean;

    constructor(id: string, color: string, startPosition: CommonTypings.Vector2D, startDirection: CommonTypings.Direction) {
        this.id = id;
        this.color = color;
        this.isAlive = true;
        this.holeState = false;
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

    resetHoleState() {
        this.holeState = false;
        this.lastHoleEnd = new Date();
    }
}

export = ServerPlayer;