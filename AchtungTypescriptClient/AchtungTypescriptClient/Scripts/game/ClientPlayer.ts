import KeyboardStates = require('./KeyboardStates');

class ClientPlayer {

    id: string;
    color: string;

    position: CommonTypings.Vector2D;
    size: CommonTypings.Size;
    speed: number;
    movement: number;
    keyboardStates: KeyboardStates;

    isLocalPlayer: boolean;
    isAlive: boolean;

    constructor(id: string, color: string, speed: number, size: CommonTypings.Size, keys: ClientTypings.KeyboardKeys){
        this.id = id;
        this.color = color;
        this.speed = speed;
        this.size = size;
        this.isLocalPlayer = (keys != null);
        this.keyboardStates = new KeyboardStates(keys);
        this.movement = 0.25;
        this.isAlive = true;
    }

    updateLogic(tickLenght: number) {
        var newPosition = this.position;

        if (this.isLocalPlayer && this.isAlive) {
            if (this.keyboardStates.isRightKeyDown) {
                this.movement += 0.1;
            }

            if (this.keyboardStates.isLeftKeyDown) {
                this.movement -= 0.1;
            }

            var speed = (this.speed / tickLenght);
            var newPos = <CommonTypings.Vector2D>{
                x: Math.round(Math.cos(this.movement) * speed + newPosition.x),
                y: Math.round(Math.sin(this.movement) * speed + newPosition.y)
            };
            newPosition = newPos;
        }
        this.position = newPosition;
    }

    draw(ctx: CanvasRenderingContext2D, deltaTick: number) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}
export = ClientPlayer;