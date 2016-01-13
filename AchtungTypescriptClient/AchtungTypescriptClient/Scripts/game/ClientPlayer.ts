import KeyboardStates = require('./KeyboardStates');
import ko = require('knockout');

class ClientPlayer implements CommonTypings.Player {

    id: string;
    color: string;

    position: KnockoutObservable<CommonTypings.Vector2D>;
    size: CommonTypings.Size;
    speed: number;
    boundingBox: CommonTypings.BoundingBox;
    keyboardStates: KeyboardStates;

    isLocalPlayer: boolean;
    isAlive: boolean;
    movementDirections: Array<number>;
    movementIndex: number;

    constructor(id: string, color: string, speed: number, size: CommonTypings.Size, keys: ClientTypings.KeyboardKeys){
        this.id = id;
        this.color = color;
        this.speed = speed;
        this.size = size;
        this.isLocalPlayer = (keys != null);
        this.keyboardStates = new KeyboardStates(keys);
        this.isAlive = true;
        this.movementDirections = [0.25, 1.75, 3.55, -1.55];
        this.movementIndex = 0;
        this.position = ko.observable<CommonTypings.Vector2D>();

        this.keyboardStates.isLeftKeyDown.subscribe(isDown => {
            if (isDown) {
                this.movementIndex -= 1;
            }
        });

        this.keyboardStates.isRightKeyDown.subscribe(isDown => {
            if (isDown) {
                this.movementIndex += 1;
            }
        });

        this.position.subscribe(newPos => {
            this.boundingBox = <CommonTypings.BoundingBox>{
                bottomLeft: <CommonTypings.Vector2D>{
                    x: newPos.x,
                    y: newPos.y + this.size.height
                },
                bottomRight: <CommonTypings.Vector2D>{
                    x: newPos.x + this.size.width,
                    y: newPos.y + this.size.height
                },
                topLeft: <CommonTypings.Vector2D>{
                    x: newPos.x,
                    y: newPos.y
                },
                topRight: <CommonTypings.Vector2D>{
                    x: newPos.x + this.size.width,
                    y: newPos.y
                }
            };
        });
    }

    updateLogic(tickLenght: number) {
        var newPosition = this.position();

        if (this.isLocalPlayer && this.isAlive) {
            if (this.movementIndex == null || this.movementIndex > this.movementDirections.length - 1) {
                this.movementIndex = 0;
            } else if (this.movementIndex < 0) {
                this.movementIndex = this.movementDirections.length - 1;
            }

            var speed = (this.speed / tickLenght);
            const movement = this.movementDirections[this.movementIndex];
            var newPos = <CommonTypings.Vector2D>{
                x: Math.round(Math.cos(movement) * speed + newPosition.x),
                y: Math.round(Math.sin(movement) * speed + newPosition.y)
            };
            newPosition = newPos;
        }
        this.position(newPosition);
    }

    draw(ctx: CanvasRenderingContext2D, deltaTick: number) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position().x, this.position().y, this.size.width, this.size.height);
    }
}
export = ClientPlayer;