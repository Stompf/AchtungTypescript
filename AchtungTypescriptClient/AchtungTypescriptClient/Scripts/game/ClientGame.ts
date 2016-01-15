import ClientMap = require('./ClientMap');
import ClientPlayer = require('./ClientPlayer');
import textArea = require('./TextArea');

class ClientGame {

    map: ClientMap;
    ctx: CanvasRenderingContext2D;
    playerSize: CommonTypings.Size;
    players: Array<ClientPlayer>;
    
    stopMain: number;
    lastTick: number;
    tickLength: number;
    lastRender: number;

    gameOn: boolean;
    gameVariables: CommonTypings.GameVariables;

    constructor(ctx: CanvasRenderingContext2D, players: Array<ClientPlayer>, gameVariables: CommonTypings.GameVariables) {
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

    startGame() {
        textArea.addText('startGame');

        window.addEventListener("blur", (e) => { this.onBlur(); }, false);
        this.ctx.canvas.addEventListener("keydown", (e) => { this.onKeyDown(e); }, false);
        this.ctx.canvas.addEventListener("keyup", (e) => { this.onKeyUp(e); }, false);

        this.mainLoop(performance.now());
        this.gameOn = true;
    }

    private mainLoop = (tFrame: number) => {
        this.stopMain = window.requestAnimationFrame(this.mainLoop);
        const nextTick = this.lastTick + this.tickLength;
        let numTicks = 0;

        //If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
        //If tFrame = nextTick then 1 tick needs to be updated (and so forth).
        //Note: As we mention in summary, you should keep track of how large numTicks is.
        //If it is large, then either your game was asleep, or the machine cannot keep up.
        if (tFrame > nextTick) {
            const timeSinceTick = tFrame - this.lastTick;
            numTicks = Math.floor(timeSinceTick / this.tickLength);
        }

        this.queueUpdates(numTicks);
        this.render(tFrame);
        this.lastRender = tFrame;
    }

    private queueUpdates = (numTicks: number) => {
        for (var i = 0; i < numTicks; i++) {
            this.lastTick = this.lastTick + this.tickLength; //Now lastTick is this tick.
            this.update(this.lastTick);
        }
    }

    private update = (lastTick: number) => {
        this.players.forEach(player => {
            player.updateLogic(this.tickLength);
            this.map.movePlayer(player);
        });
    }

    private render = (tFrame: number) => {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.players.forEach(player => {
            this.map.draw(this.ctx, tFrame);
        });
    }

    private onBlur() {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].keyboardStates != null) {
                this.players[i].keyboardStates.resetAll();
            }
        }
    }

    private onKeyDown(e: KeyboardEvent) {
        if (!this.gameOn) {
            return;
        }

        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].keyboardStates != null && this.players[i].keyboardStates.keyDown(e.keyCode)) {
                break;
            }
        }
    }

    private onKeyUp(e: KeyboardEvent) {
        if (!this.gameOn) {
            return;
        }

        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].keyboardStates != null && this.players[i].keyboardStates.keyUp(e.keyCode)) {
                break;
            }
        }
    }
}
export = ClientGame;