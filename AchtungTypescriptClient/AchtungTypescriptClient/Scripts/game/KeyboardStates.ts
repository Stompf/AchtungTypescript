class KeyboardStates {

    static W = 87;
    static S = 83;
    static A = 65;
    static D = 68;

    static ArrowUp = 38;
    static ArrowDown = 40;
    static ArrowLeft = 37;
    static ArrowRight = 39;

    isUpKeyDown: boolean;
    isDownKeyDown: boolean;
    isLeftKeyDown: boolean;
    isRightKeyDown: boolean;

    keys: ClientTypings.KeyboardKeys;

    constructor(keys: ClientTypings.KeyboardKeys) {
        this.keys = keys;
    }

    keyDown(keycode: number) {
        return this.handleKeycodes(keycode, true);
    }

    keyUp(keycode: number) {
        return this.handleKeycodes(keycode, false);
    }

    resetAll() {
        this.isUpKeyDown = false;
        this.isDownKeyDown = false;
        this.isLeftKeyDown = false;
        this.isRightKeyDown = false;
    }

    private handleKeycodes(keycode: number, isDown: boolean) {
        switch (keycode) {
            case this.keys.up:
                this.isUpKeyDown = isDown;
                return true;
            case this.keys.down:
                this.isDownKeyDown = isDown;
                return true;
            case this.keys.left:
                this.isLeftKeyDown = isDown;
                return true;
            case this.keys.right:
                this.isRightKeyDown = isDown;
                return true;
            default:
                return false;
        }
    }

} export = KeyboardStates;