import ClientMap = require('./ClientMap');
import ClientPlayer = require('./ClientPlayer');
import textArea = require('./TextArea');
import moment = require('moment');

class ClientGame {

    map: ClientMap;
    ctx: CanvasRenderingContext2D;
    playerSize: CommonTypings.Size;
    players: Array<ClientPlayer>;

    stopMain: number;
    lastTick: number;
    lastRender: number;

    gameOn: boolean;
    gameOptions: CommonTypings.GameOptions;

    constructor(ctx: CanvasRenderingContext2D, players: Array<ClientPlayer>, gameOptions: CommonTypings.GameOptions) {
        this.ctx = ctx
        this.ctx.canvas.tabIndex = 1;
        this.ctx.canvas.style.outline = 'none';

        this.players = players;

        this.lastTick = performance.now();
        this.lastRender = this.lastTick; //Pretend the first draw was on first update.

        this.gameOptions = gameOptions;

        this.map = new ClientMap(this.ctx.canvas.width, this.ctx.canvas.height, this.gameOptions.playerSize);
    }

    startGame() {
        textArea.addText('startGame');
        this.map = new ClientMap(this.ctx.canvas.width, this.ctx.canvas.height, this.gameOptions.playerSize);
        this.lastTick = performance.now();
        this.lastRender = this.lastTick; //Pretend the first draw was on first update.

        this.players.forEach(player => {
            player.resetHoleState();
            player.isAlive = true;
            player.position = this.map.getRandomPosition(50);
        });

        window.addEventListener('blur', () => { this.onBlur(); }, false);
        this.ctx.canvas.addEventListener('keydown', (e) => { this.onKeyDown(e); }, false);
        this.ctx.canvas.addEventListener('keyup', (e) => { this.onKeyUp(e); }, false);

        this.players.forEach(player => {
            const mapBoxID = this.map.toMapBoxId(player.position.x, player.position.y);
            this.map.mapBox.setValue(mapBoxID, <CommonTypings.MapBox>{ player: player, mapboxID: mapBoxID });
        });

        this.mainLoop(performance.now());

        setTimeout(() => {
            this.gameOn = true;
            this.players.forEach(player => {
                player.resetHoleState();
            });
        }, 2500);
    }

    stopGame() {
        textArea.addText('Game stopped.');
        window.cancelAnimationFrame(this.stopMain);
    }

    private mainLoop = (tFrame: number) => {
        this.stopMain = window.requestAnimationFrame(this.mainLoop);
        const nextTick = this.lastTick + this.gameOptions.tickLength;
        let numTicks = 0;

        //If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
        //If tFrame = nextTick then 1 tick needs to be updated (and so forth).
        //Note: As we mention in summary, you should keep track of how large numTicks is.
        //If it is large, then either your game was asleep, or the machine cannot keep up.
        if (tFrame > nextTick) {
            const timeSinceTick = tFrame - this.lastTick;
            numTicks = Math.floor(timeSinceTick / this.gameOptions.tickLength);
        }

        this.queueUpdates(numTicks);
        this.render(tFrame);
        this.lastRender = tFrame;
    }

    private queueUpdates = (numTicks: number) => {
        for (let i = 0; i < numTicks; i++) {
            this.lastTick = this.lastTick + this.gameOptions.tickLength; //Now lastTick is this tick.
            this.update(this.lastTick);
        }
    }

    private update = (lastTick: number) => {
        if (!this.gameOn) {
            return;
        }

        this.players.forEach(player => {
            if (!player.holeState && player.isAlive) {
                if (player.lastHoleEnd == null) {
                    player.lastHoleEnd = new Date();
                }
                const time = moment(player.lastHoleEnd).add(this.gameOptions.holeInterval, 'milliseconds').toDate().getTime();
                const randValue = Math.random() * 1000;
                if (time <= new Date().getTime() && randValue <= this.gameOptions.holeChancePrecent) {
                    player.holeState = true;
                    setTimeout(() => {
                        player.resetHoleState();
                    }, Math.floor(Math.random() * this.gameOptions.maxHoleSize) + this.gameOptions.minHoleSize);
                }
            }

            this.map.movePlayer(player);
        }); 

        const gameOver = this.players.filter(player => {
            return player.isAlive;
        });

        if (gameOver.length <= 1) {
            this.gameOn = false;
            window.cancelAnimationFrame(this.stopMain);

            if (gameOver.length === 1) {
                const winner = gameOver[0];
                textArea.addText(winner.color + ' won the round!');
                winner.score++;

                const scoreString = this.players.map(player => {
                    return player.color + ': ' + player.score;
                }).join(' - ');

                if (winner.score >= this.gameOptions.roundsToWin) {
                    textArea.addText('Game over! Final score: ' + scoreString);
                    textArea.addText(winner.color + ' won the game!');
                } else {
                    textArea.addText('Current score: ' + scoreString + '. First to ' + this.gameOptions.roundsToWin + ' wins the game!');
                    const roundWait = 5000;
                    textArea.addText('Next round starts in ' + roundWait / 1000 + 's');
                    setTimeout(() => {
                        this.startGame();
                    }, roundWait);
                }
            } else {
                const scoreString = this.players.map(player => {
                    return player.color + ': ' + player.score;
                }).join(' - ');
                textArea.addText('Draw!');
                textArea.addText('Current score: ' + scoreString + '. First to ' + this.gameOptions.roundsToWin + ' wins the game!');
                const roundWait = 5000;
                textArea.addText('Next round starts in ' + roundWait / 1000 + 's');
                setTimeout(() => {
                    this.startGame();
                }, roundWait);
            }
        }
    }

    private render = (tFrame: number) => {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.map.draw(this.ctx, tFrame);

        this.players.forEach(player => {
            if (player.isAlive) {
                player.draw(this.ctx);
                this.map.drawDirectionArrow(this.ctx, player.direction, player.position);
            }
        });
    }

    private onBlur() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].keyboardStates != null) {
                this.players[i].keyboardStates.resetAll();
            }
        }
    }

    private onKeyDown(e: KeyboardEvent) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].keyboardStates != null && this.players[i].keyboardStates.keyDown(e.keyCode)) {
                break;
            }
        }
    }

    private onKeyUp(e: KeyboardEvent) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].keyboardStates != null && this.players[i].keyboardStates.keyUp(e.keyCode)) {
                break;
            }
        }
    }
}
export = ClientGame;