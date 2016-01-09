define(["require", "exports", './ClientMap'], function (require, exports, ClientMap) {
    var ClientGame = (function () {
        function ClientGame(ctx, players, gameVariables) {
            var _this = this;
            this.mainLoop = function (tFrame) {
                _this.stopMain = window.requestAnimationFrame(_this.mainLoop);
                var nextTick = _this.lastTick + _this.tickLength;
                var numTicks = 0;
                //If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
                //If tFrame = nextTick then 1 tick needs to be updated (and so forth).
                //Note: As we mention in summary, you should keep track of how large numTicks is.
                //If it is large, then either your game was asleep, or the machine cannot keep up.
                if (tFrame > nextTick) {
                    var timeSinceTick = tFrame - _this.lastTick;
                    numTicks = Math.floor(timeSinceTick / _this.tickLength);
                }
                _this.queueUpdates(numTicks);
                _this.render(tFrame);
                _this.lastRender = tFrame;
            };
            this.queueUpdates = function (numTicks) {
                for (var i = 0; i < numTicks; i++) {
                    _this.lastTick = _this.lastTick + _this.tickLength; //Now lastTick is this tick.
                    _this.update(_this.lastTick);
                }
            };
            this.update = function (tFrame) {
                _this.players.forEach(function (player) {
                    player.updateLogic(tFrame);
                });
            };
            this.render = function (tFrame) {
                _this.players.forEach(function (player) {
                    player.draw(_this.ctx, tFrame);
                });
            };
            this.ctx = ctx;
            this.ctx.canvas.tabIndex = 1;
            this.ctx.canvas.style.outline = "none";
            this.players = players;
            this.lastTick = performance.now();
            this.lastRender = this.lastTick; //Pretend the first draw was on first update.
            this.gameVariables = gameVariables;
            this.tickLength = gameVariables.tickLength; //This sets your simulation to run at 20Hz (50ms)
            this.map = new ClientMap(this.ctx.canvas.width, this.ctx.canvas.height, this.gameVariables.playerSize);
        }
        ClientGame.prototype.startGame = function () {
            var _this = this;
            window.addEventListener("blur", function (e) { _this.onBlur(); }, false);
            this.ctx.canvas.addEventListener("keydown", function (e) { _this.onKeyDown(e); }, false);
            this.ctx.canvas.addEventListener("keyup", function (e) { _this.onKeyUp(e); }, false);
            this.mainLoop(performance.now());
            this.gameOn = true;
        };
        ClientGame.prototype.onBlur = function () {
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].keyboardStates != null) {
                    this.players[i].keyboardStates.resetAll();
                }
            }
        };
        ClientGame.prototype.onKeyDown = function (e) {
            if (!this.gameOn) {
                return;
            }
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].keyboardStates != null && this.players[i].keyboardStates.keyDown(e.keyCode)) {
                    break;
                }
            }
        };
        ClientGame.prototype.onKeyUp = function (e) {
            if (!this.gameOn) {
                return;
            }
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].keyboardStates != null && this.players[i].keyboardStates.keyUp(e.keyCode)) {
                    break;
                }
            }
        };
        return ClientGame;
    })();
    return ClientGame;
});
//# sourceMappingURL=ClientGame.js.map