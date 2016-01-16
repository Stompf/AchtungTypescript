import KeyboardStates = require('./KeyboardStates');
import ko = require('knockout');
import textArea = require('./TextArea');

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
    }
}
export = ClientPlayer;