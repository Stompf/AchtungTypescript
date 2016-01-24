import socketIO = require('socket.io-client');
import ClientGame = require('./ClientGame');
import NetworkGame = require('./NetworkGame');
import ClientPlayer = require('./ClientPlayer');
import KeyboardStates = require('./KeyboardStates');
import localGameVariables = require('./LocalGameVariables');
import textArea = require('./TextArea');
import ko = require('knockout');

class AchtungTypescript {
    currentStep: KnockoutObservable<string>;

    canvasElement: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    socket: SocketIOClient.Socket;
    currentGame: ClientGame;

    networkAddress = 'http://lunne.noip.me:3000';

    constructor(canvas: HTMLCanvasElement) {
        this.currentStep = ko.observable('main');
        this.canvasElement = canvas;
        this.ctx = canvas.getContext('2d');
    }

    init() {
        const element = $('#main')[0];
        ko.cleanNode(element);
        ko.applyBindings(this, element);
    }

    startNetwork = () => {
        textArea.clearText();
        textArea.addText('Connecting to LunneNET...');
        this.socket = socketIO(this.networkAddress);

        this.initAchtungCommands();
    }

    startLocal = () => {
        if (this.currentGame) {
            this.currentGame.stopGame();
        }

        textArea.clearText();
        const localPlayer1 = new ClientPlayer('local_1', 'blue', localGameVariables.playerSpeed, localGameVariables.playerSize, <ClientTypings.KeyboardKeys>{ left: KeyboardStates.A, right: KeyboardStates.D, up: KeyboardStates.W, down: KeyboardStates.S });
        const localPlayer2 = new ClientPlayer('local_2', 'red', localGameVariables.playerSpeed, localGameVariables.playerSize, <ClientTypings.KeyboardKeys>{ left: KeyboardStates.ArrowLeft, right: KeyboardStates.ArrowRight, up: KeyboardStates.ArrowUp, down: KeyboardStates.ArrowDown });

        const localPlayers = [localPlayer1, localPlayer2];

        this.currentGame = new ClientGame(this.ctx, localPlayers, localGameVariables);

        localPlayers.forEach(player => {
            player.position = this.currentGame.map.getRandomPosition(50);
        });

        this.currentGame.startGame();
    }

    private initAchtungCommands() {
        this.socket.on('chat message', (msg: string) => {
            textArea.addText('chat message: ' + msg);
        });

        this.socket.on('LookingForGame', (obj: AchtungCommunication.LookingForGame) => {
            textArea.addText('Connected! LookingForGame....');
        });

        this.socket.on('GameFound', (obj: AchtungCommunication.GameFound) => {
            textArea.addText('GameFound! Starting match...');
            const localPlayer = _.find(obj.players, player => {
                return player.id === obj.playerID;
            });

            textArea.addText('Your are player - <span style="color: ' + localPlayer.color + '">' + localPlayer.color + '</span>');

            const networkGame = new NetworkGame(this.ctx, obj.players, obj.gameVariables, obj.playerID);
            networkGame.initSocketCommands(this.socket);
        });

        this.socket.on('disconnect', () => {
            textArea.addText('Disconnected');
        });
    }
} export = AchtungTypescript;