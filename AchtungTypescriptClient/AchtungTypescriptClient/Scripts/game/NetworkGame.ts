﻿import ClientMap = require('./ClientMap');
import ClientPlayer = require('./ClientPlayer');
import textArea = require('./TextArea');
import moment = require('moment');

class NetworkGame {

    map: ClientMap;
    ctx: CanvasRenderingContext2D;
    playerSize: CommonTypings.Size;
    players: Array<CommonTypings.Player>;
    socket: SocketIOClient.Socket;

    stopMain: number;
    lastTick: number;
    tickLength: number;
    lastRender: number;
    lastServerTick: number;

    gameOn: boolean;
    gameVariables: CommonTypings.GameVariables;

    lastDirectionChange: moment.Moment;
    waitTime: number = 500;

    constructor(ctx: CanvasRenderingContext2D, players: Array<CommonTypings.Player>, gameVariables: CommonTypings.GameVariables, socket: SocketIOClient.Socket) {
        this.ctx = ctx;
        this.ctx.canvas.tabIndex = 1;
        this.ctx.canvas.style.outline = "none";

        this.players = players;

        this.lastTick = performance.now();
        this.lastRender = this.lastTick; //Pretend the first draw was on first update.
        this.lastServerTick = 0;

        this.gameVariables = gameVariables;
        this.socket = socket;
        this.initSocketCommands(socket);
        this.lastDirectionChange = moment();

        this.tickLength = gameVariables.tickLength; //This sets your simulation to run at 20Hz (50ms)

        this.map = new ClientMap(this.ctx.canvas.width, this.ctx.canvas.height, this.gameVariables.playerSize);
    }

    startGame() {
        textArea.addText('startGame');

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

        this.players.forEach(player => {
            this.map.draw(this.ctx, tFrame);
        });
    }

    private onKeyDown(e: KeyboardEvent) {
        if (!this.gameOn && moment().add(this.waitTime, 'milliseconds').diff(this.lastDirectionChange) > 0) {
            return;
        }

        let direction: CommonTypings.Direction = null;
        if (e.keyCode === 65) { //A
            direction = CommonTypings.Direction.LEFT;
        } else if (e.keyCode === 83) { //S
            direction = CommonTypings.Direction.RIGHT;
        } 

        if (direction != null) {
            this.socket.emit('NewDirection', <AchtungCommunication.NewDirection>{
                direction: direction
            });
        }

        this.lastDirectionChange = moment();
    }

    private initSocketCommands(socket: SocketIOClient.Socket) {
        socket.on('StartGame', (obj: AchtungCommunication.StartGame) => {
            textArea.addText('StartGame: ' + obj.timeToStart.toString());
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
        });

        socket.emit('PlayerReady', <AchtungCommunication.PlayerReady>{});
    }
}
export = NetworkGame;