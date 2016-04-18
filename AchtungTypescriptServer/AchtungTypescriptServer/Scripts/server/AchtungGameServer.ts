import collections = require('../collections');
import ServerPlayer = require('./ServerPlayer');
import ServerMap = require('./ServerMap');
import matchMakingOptions = require('./MatchMakingOptions');
import moment = require('moment');

class AchtungServer {

    id: string;
    players: collections.Dictionary<string, ServerPlayer>;
    playerSockets: collections.Dictionary<string, SocketIO.Socket>;
    map: ServerMap;
    colors: Array<string> = ['blue', 'red', 'black', 'yellow', 'cyan'];
    tick: number;
    interval: NodeJS.Timer;
    startTimeout: NodeJS.Timer;
    isPaused: boolean;

    constructor(id: string, playerSockets: Array<SocketIO.Socket>) {
        this.players = new collections.Dictionary<string, ServerPlayer>();
        this.playerSockets = new collections.Dictionary<string, SocketIO.Socket>();
        this.id = id;
        this.tick = 0;
        this.map = new ServerMap();
        this.isPaused = true;

        playerSockets.forEach((playerSocket, index) => {
            this.playerSockets.setValue(playerSocket.id, playerSocket);
            this.players.setValue(playerSocket.id, new ServerPlayer(playerSocket.id, this.colors[index]));
            this.initPlayerSocketEvents(playerSocket);
        });
    }

    startServer() {
        this.isPaused = true;
        const startDate = moment().add(2.5, 'seconds').toDate();
        this.map = new ServerMap();
        this.players.values().forEach(player => {
            player.isAlive = true;
            player.position = this.map.getRandomPosition(100);
            player.direction = this.getRandomDirection();

            const mapBoxId = this.map.toMapBoxId(player.position.x, player.position.y);
            this.map.mapBox.setValue(mapBoxId, <CommonTypings.MapBox>{
                mapboxID: mapBoxId,
                player: player
            });
        });

        this.playerSockets.values().forEach(playerSocket => {
            playerSocket.emit('StartGame', <AchtungCommunication.StartGame>{
                timeToStart: startDate,
                mapBox: this.map.mapBox.values()
            });
        });

        this.startTimeout = setTimeout(() => {
            this.isPaused = false;
            this.players.values().forEach(player => {
                player.resetHoleState();
            });
        }, startDate.getTime() - new Date().getTime());

        this.interval = setInterval(() => {
            this.tick++;

            if (!this.isPaused) {
                this.players.values().forEach(player => {
                    if (!player.holeState && player.isAlive) {
                        if (player.lastHoleEnd == null) {
                            player.lastHoleEnd = new Date();
                        }
                        const time = moment(player.lastHoleEnd).add(matchMakingOptions.holeInterval, 'milliseconds').toDate().getTime();
                        const randValue = Math.random() * 1000;
                        if (time <= new Date().getTime() && randValue <= matchMakingOptions.holeChancePrecent) {
                            player.holeState = true;
                            setTimeout(() => {
                                player.resetHoleState();
                            }, Math.floor(Math.random() * matchMakingOptions.maxHoleSize) + matchMakingOptions.minHoleSize);
                        }
                    }

                    this.map.movePlayer(player);
                });


                const gameOver = this.players.values().filter(player => {
                    return player.isAlive;
                });

                if (gameOver.length <= 1) {
                    this.playerSockets.values().forEach(playerSocket => {
                        playerSocket.emit('ServerTick', <AchtungCommunication.ServerTick>{
                            tick: this.tick,
                            mapBox: this.map.mapBox.values(),
                            players: this.players.values()
                        });
                    });

                    clearInterval(this.interval);
                    if (gameOver.length === 1) {
                        gameOver[0].score++;
                    }

                    if (gameOver.length === 1 && gameOver[0].score >= matchMakingOptions.roundsToWin) {

                        this.playerSockets.values().forEach(playerSocket => {
                            playerSocket.emit('GameOver', <AchtungCommunication.GameOver>{
                                mapBox: this.map.mapBox.values(),
                                winner: gameOver[0]
                            });
                        });

                    } else {
                        const nextRoundTime = 5000;
                        this.playerSockets.values().forEach(playerSocket => {
                            playerSocket.emit('RoundOver', <AchtungCommunication.RoundOver>{
                                mapBox: this.map.mapBox.values(),
                                winner: gameOver.length === 1 ? gameOver[0] : null,
                                timeToNextRound: nextRoundTime,
                                players: this.players.values()
                            });
                        });

                        setTimeout(() => {
                            this.startServer();
                        }, nextRoundTime);
                    }
                } else {
                    this.playerSockets.values().forEach(playerSocket => {
                        playerSocket.emit('ServerTick', <AchtungCommunication.ServerTick>{
                            tick: this.tick,
                            mapBox: this.map.mapBox.values(),
                            players: this.players.values()
                        });
                    });
                }
            }
        }, matchMakingOptions.tickLength);
    }

    stopGame() {
        clearTimeout(this.startTimeout);
        clearInterval(this.interval);
        this.playerSockets.values().forEach(playerSocket => {
            playerSocket.emit('GameOver', <AchtungCommunication.GameOver>{
                mapBox: this.map.mapBox.values(),
                winner: null
            });
        });
    }

    private initPlayerSocketEvents(playerSocket: SocketIO.Socket) {
        playerSocket.on('PlayerReady', (obj: AchtungCommunication.PlayerReady) => {
            this.players.getValue(playerSocket.id).ready = true;
            this.checkIfAllReady();
        });

        playerSocket.on('NewDirection', (obj: AchtungCommunication.NewDirection) => {
            this.players.getValue(playerSocket.id).changeDirection(obj.direction);
        });

        playerSocket.on('disconnect', () => {
            this.players.getValue(playerSocket.id).isAlive = false;
        });
    }

    private checkIfAllReady() {
        const allReady = this.players.values().every(player => {
            return player.ready;
        });

        if (allReady) {
            this.startServer();
        }
    }

    private getRandomDirection() {
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                return CommonTypings.Direction.UP;
            case 1:
                return CommonTypings.Direction.DOWN;
            case 2:
                return CommonTypings.Direction.RIGHT;
            case 3:
                return CommonTypings.Direction.LEFT;
            default:
                return CommonTypings.Direction.UP;
        }
    }

}

export = AchtungServer;