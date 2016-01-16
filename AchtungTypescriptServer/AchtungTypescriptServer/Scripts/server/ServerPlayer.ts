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

        if ((now + this.waitTime) > this.lastDirectionChanged) {
            return;
        }     

        switch (direction) {
            case CommonTypings.Direction.LEFT:
                this.moveLeft();
                break;
            case CommonTypings.Direction.RIGHT:
                this.moveRight();
                break;
            default:
                break;
        }

        this.lastDirectionChanged = now;
    }

    private moveRight() {
        switch (this.direction) {
            case CommonTypings.Direction.UP:
                this.direction = CommonTypings.Direction.LEFT;
                break;
            case CommonTypings.Direction.DOWN:
                this.direction = CommonTypings.Direction.RIGHT;
                break;
            case CommonTypings.Direction.RIGHT:
                this.direction = CommonTypings.Direction.UP;
                break;
            case CommonTypings.Direction.LEFT:
                this.direction = CommonTypings.Direction.DOWN;
                break;
            default:
                break;
        }
    }

    private moveLeft() {
        switch (this.direction) {
            case CommonTypings.Direction.UP:
                this.direction = CommonTypings.Direction.RIGHT;
                break;
            case CommonTypings.Direction.DOWN:
                this.direction = CommonTypings.Direction.LEFT;
                break;
            case CommonTypings.Direction.RIGHT:
                this.direction = CommonTypings.Direction.DOWN;
                break;
            case CommonTypings.Direction.LEFT:
                this.direction = CommonTypings.Direction.UP;
                break;
            default:
                break;
        }
    }
}
export = ServerPlayer;