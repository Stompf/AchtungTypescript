define(["require", "exports", './KeyboardStates'], function (require, exports, KeyboardStates) {
    var ClientPlayer = (function () {
        function ClientPlayer(id, color, speed, size, keys) {
            this.id = id;
            this.color = color;
            this.speed = speed;
            this.size = size;
            this.isLocalPlayer = (keys != null);
            this.keyboardStates = new KeyboardStates(keys);
            this.movement = 0.25;
            this.isAlive = true;
        }
        ClientPlayer.prototype.updateLogic = function (tickLenght) {
            var newPosition = this.position;
            if (this.isLocalPlayer && this.isAlive) {
                if (this.keyboardStates.isRightKeyDown) {
                    this.movement += 0.1;
                }
                if (this.keyboardStates.isLeftKeyDown) {
                    this.movement -= 0.1;
                }
                var speed = (this.speed / tickLenght);
                var newPos = {
                    x: Math.round(Math.cos(this.movement) * speed + newPosition.x),
                    y: Math.round(Math.sin(this.movement) * speed + newPosition.y)
                };
                newPosition = newPos;
            }
            this.position = newPosition;
        };
        ClientPlayer.prototype.draw = function (ctx, deltaTick) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        };
        return ClientPlayer;
    })();
    return ClientPlayer;
});
//# sourceMappingURL=ClientPlayer.js.map