import KeyboardStates = require('./KeyboardStates');
import ko = require('knockout');

class ClientPlayer implements CommonTypings.Player {

    id: string;
    color: string;

    position:CommonTypings.Vector2D;
    size: CommonTypings.Size;
    speed: number;
    //boundingBox: CommonTypings.BoundingBox;
    keyboardStates: KeyboardStates;

    isLocalPlayer: boolean;
    isAlive: boolean;
    direction: CommonTypings.Direction;

    constructor(id: string, color: string, speed: number, size: CommonTypings.Size, keys: ClientTypings.KeyboardKeys){
        this.id = id;
        this.color = color;
        this.speed = speed;
        this.size = size;
        this.isLocalPlayer = (keys != null);
        this.keyboardStates = new KeyboardStates(keys);
        this.isAlive = true;
        this.direction = CommonTypings.Direction.RIGHT;

        this.keyboardStates.isLeftKeyDown.subscribe(isDown => {
            if (isDown) {
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
        });

        this.keyboardStates.isRightKeyDown.subscribe(isDown => {
            if (isDown) {
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
        });

        //this.position.subscribe(newPos => {
        //    this.boundingBox = <CommonTypings.BoundingBox>{
        //        bottomLeft: <CommonTypings.Vector2D>{
        //            x: newPos.x,
        //            y: newPos.y + this.size.height
        //        },
        //        bottomRight: <CommonTypings.Vector2D>{
        //            x: newPos.x + this.size.width,
        //            y: newPos.y + this.size.height
        //        },
        //        topLeft: <CommonTypings.Vector2D>{
        //            x: newPos.x,
        //            y: newPos.y
        //        },
        //        topRight: <CommonTypings.Vector2D>{
        //            x: newPos.x + this.size.width,
        //            y: newPos.y
        //        }
        //    };
        //});
    }

    updateLogic(tickLenght: number) {
        //var newPosition = this.position();

        //if (this.isLocalPlayer && this.isAlive) {
        //    if (this.movementIndex == null || this.movementIndex > this.movementDirections.length - 1) {
        //        this.movementIndex = 0;
        //    } else if (this.movementIndex < 0) {
        //        this.movementIndex = this.movementDirections.length - 1;
        //    }
        //    /*
        //    var speed = (this.speed / tickLenght);
        //    const movement = this.movementDirections[this.movementIndex];
        //    var newPos = <CommonTypings.Vector2D>{
        //        x: Math.round(Math.cos(movement) * speed + newPosition.x),
        //        y: Math.round(Math.sin(movement) * speed + newPosition.y)
        //    };
        //    newPosition = newPos;*/
        //}
        //this.position(newPosition);
    }


    draw(ctx: CanvasRenderingContext2D, deltaTick: number) {
        /*ctx.fillStyle = this.color;
        ctx.fillRect(this.position().x, this.position().y, this.size.width, this.size.height);*/
    }
}
export = ClientPlayer;