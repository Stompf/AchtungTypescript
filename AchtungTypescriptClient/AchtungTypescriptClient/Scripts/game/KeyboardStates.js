define(["require", "exports"], function (require, exports) {
    var KeyboardStates = (function () {
        function KeyboardStates(keys) {
            this.keys = keys;
        }
        KeyboardStates.prototype.keyDown = function (keycode) {
            return this.handleKeycodes(keycode, true);
        };
        KeyboardStates.prototype.keyUp = function (keycode) {
            return this.handleKeycodes(keycode, false);
        };
        KeyboardStates.prototype.resetAll = function () {
            this.isUpKeyDown = false;
            this.isDownKeyDown = false;
            this.isLeftKeyDown = false;
            this.isRightKeyDown = false;
        };
        KeyboardStates.prototype.handleKeycodes = function (keycode, isDown) {
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
        };
        KeyboardStates.W = 87;
        KeyboardStates.S = 83;
        KeyboardStates.A = 65;
        KeyboardStates.D = 68;
        KeyboardStates.ArrowUp = 38;
        KeyboardStates.ArrowDown = 40;
        KeyboardStates.ArrowLeft = 37;
        KeyboardStates.ArrowRight = 39;
        return KeyboardStates;
    })();
    return KeyboardStates;
});
//# sourceMappingURL=KeyboardStates.js.map