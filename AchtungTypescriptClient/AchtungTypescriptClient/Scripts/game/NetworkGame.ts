import ClientMap = require('./ClientMap');
import ClientPlayer = require('./ClientPlayer');
import KeyboardStates = require('./KeyboardStates');
import textArea = require('./TextArea');
import moment = require('moment');

class NetworkGame {

    map: ClientMap;
    ctx: CanvasRenderingContext2D;
    playerSize: CommonTypings.Size;
    players: Array<CommonTypings.Player>;
    socket: SocketIOClient.Socket;
    playerID: string;

    stopMain: number;
    lastTick: number;
    tickLength: number;
    lastRender: number;
    lastServerTick: number;

    gameOn: boolean;
    gameVariables: CommonTypings.GameVariables;

    lastDirectionChange: moment.Moment;
    waitTime: number = 500;

    constructor(ctx: CanvasRenderingContext2D, players: Array<CommonTypings.Player>, gameVariables: CommonTypings.GameVariables, playerID: string) {
        this.ctx = ctx;
        this.ctx.canvas.tabIndex = 1;
        this.ctx.canvas.style.outline = "none";

        this.players = players;
        this.playerID = playerID;

        this.lastTick = performance.now();
        this.lastRender = this.lastTick; //Pretend the first draw was on first update.
        this.lastServerTick = 0;

        this.gameVariables = gameVariables;
        this.lastDirectionChange = moment();

        this.tickLength = gameVariables.tickLength; //This sets your simulation to run at 20Hz (50ms)

        this.map = new ClientMap(this.ctx.canvas.width, this.ctx.canvas.height, this.gameVariables.playerSize);
    }

    initSocketCommands(socket: SocketIOClient.Socket) {
        socket.on('StartGame', (obj: AchtungCommunication.StartGame) => {
            const diff = Math.abs(moment.duration(moment().diff(moment(obj.timeToStart))).asSeconds());
            textArea.addText('Game starting in ' + diff + ' seconds');
            obj.mapBox.forEach(mapBox => {
                this.map.mapBox.setValue(mapBox.mapboxID, mapBox);
            });
            this.startGame();
        });

        socket.on('ServerTick', (obj: AchtungCommunication.ServerTick) => {
            if (obj.tick <= this.lastServerTick) {
                return;
            }

            this.map.mapBox.clear();

            obj.mapBox.forEach(mapBox => {
                this.map.mapBox.setValue(mapBox.mapboxID, mapBox);
            });

            this.lastServerTick = obj.tick;
            this.players = obj.players;
        });

        socket.on('GameOver', (obj: AchtungCommunication.GameOver) => {
            this.map.mapBox.clear();

            obj.mapBox.forEach(mapBox => {
                this.map.mapBox.setValue(mapBox.mapboxID, mapBox);
            });

            window.cancelAnimationFrame(this.stopMain);

            if (obj.winner != null) {
                textArea.addText(obj.winner.color + ' (' + obj.winner.id + ') won!');
            } else {
                textArea.addText('Its a draw!');
            }
        });

        socket.emit('PlayerReady', <AchtungCommunication.PlayerReady>{});
    }

    private startGame() {
        this.ctx.canvas.addEventListener("keydown", (e) => { this.onKeyDown(e); }, false);

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

    }

    private render = (tFrame: number) => {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.map.draw(this.ctx, tFrame);

        if (this.map.mapBox.size() <= this.players.length) {
            this.players.forEach(player => {
                this.map.drawDirectionArrow(this.ctx, player.direction, player.position);
            });
        }
    }

    private onKeyDown(e: KeyboardEvent) {
        if (!this.gameOn && moment().add(this.waitTime, 'milliseconds').diff(this.lastDirectionChange) > 0) {
            return;
        }

        let direction: CommonTypings.Direction = null;
        if (e.keyCode === KeyboardStates.W) {
            direction = CommonTypings.Direction.UP;
        } else if (e.keyCode === KeyboardStates.S) {
            direction = CommonTypings.Direction.DOWN;
        } else if (e.keyCode === KeyboardStates.A) {
            direction = CommonTypings.Direction.LEFT;
        } else if (e.keyCode === KeyboardStates.D) {
            direction = CommonTypings.Direction.RIGHT;
        } 

        if (direction != null) {
            this.socket.emit('NewDirection', <AchtungCommunication.NewDirection>{
                direction: direction
            });
        }

        this.lastDirectionChange = moment();
    }

  
}
export = NetworkGame;