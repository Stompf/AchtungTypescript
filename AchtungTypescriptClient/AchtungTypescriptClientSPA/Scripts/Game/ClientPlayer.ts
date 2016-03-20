import KeyboardStates = require('./KeyboardStates');
import ko = require('knockout');
import textArea = require('./TextArea');

class ClientPlayer implements CommonTypings.Player {

    id: string;
    color: string;

    position: CommonTypings.Vector2D;
    size: CommonTypings.Size;
    speed: number;
    keyboardStates: KeyboardStates;

    isLocalPlayer: boolean;
    isAlive: boolean;
    holeState: boolean;
    lastHoleEnd: Date;
    direction: CommonTypings.Direction;

    constructor(id: string, color: string, speed: number, size: CommonTypings.Size, keys: ClientTypings.KeyboardKeys) {
        this.id = id;
        this.color = color;
        this.speed = speed;
        this.size = size;
        this.isLocalPlayer = (keys != null);
        this.keyboardStates = new KeyboardStates(keys);
        this.isAlive = true;
        this.holeState = false;
        this.direction = CommonTypings.Direction.RIGHT;

        this.keyboardStates.isUpKeyDown.subscribe(isDown => {
            if (isDown && this.direction !== CommonTypings.Direction.DOWN) {
                this.direction = CommonTypings.Direction.UP;
            }
        })

        this.keyboardStates.isDownKeyDown.subscribe(isDown => {
            if (isDown && this.direction !== CommonTypings.Direction.UP) {
                this.direction = CommonTypings.Direction.DOWN;
            }
        });

        this.keyboardStates.isLeftKeyDown.subscribe(isDown => {
            if (isDown && this.direction !== CommonTypings.Direction.RIGHT) {
                this.direction = CommonTypings.Direction.LEFT;
            }
        });

        this.keyboardStates.isRightKeyDown.subscribe(isDown => {
            if (isDown && this.direction !== CommonTypings.Direction.LEFT) {
                this.direction = CommonTypings.Direction.RIGHT;
            }
        });
    }

    resetHoleState() {
        this.holeState = false;
        this.lastHoleEnd = new Date();
    }
}
export = ClientPlayer;