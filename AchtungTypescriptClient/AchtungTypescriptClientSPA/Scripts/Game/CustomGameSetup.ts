import ko = require('knockout');
import AchtungTypescript = require('./AchtungTypescript');
import textArea = require('./TextArea');

class CustomGameSetup {

    maxPlayers: KnockoutObservable<number>;
    maxPlayersOptions: KnockoutObservableArray<number>;
    aiPlayers: KnockoutObservable<number>;
    aiPlayersOptions: KnockoutObservableArray<number>;
    roundsToWin: KnockoutObservable<number>;
    gameMode: KnockoutObservable<string>;
    playerSpeed: KnockoutObservable<number>;
    playerSize: KnockoutObservable<number>;
    allowItems: KnockoutObservable<boolean>;
    minMatchmakingRaiting: KnockoutObservable<number>;
    maxMatchmakingRaiting: KnockoutObservable<number>;
    serverName: KnockoutObservable<string>;

    allowSpectators: KnockoutObservable<boolean>;
    localGameOnly: KnockoutObservable<boolean>;
    players: KnockoutObservableArray<CommonTypings.Player>;
    playerHost: CommonTypings.Player;
    chat: KnockoutObservableArray<string>;

    private achtungTypescript: AchtungTypescript;

    constructor(achtungTypescript: AchtungTypescript) {
        this.achtungTypescript = achtungTypescript;
        this.maxPlayers = ko.observable<number>(1);
        this.maxPlayersOptions = ko.observableArray<number>([1, 2, 3, 4, 5, 6, 7, 8]);
        this.aiPlayers = ko.observable<number>(0);
        this.aiPlayersOptions = ko.observableArray<number>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        this.roundsToWin = ko.observable<number>(5);
        this.gameMode = ko.observable<string>('normal');
        this.playerSpeed = ko.observable<number>(50);
        this.playerSize = ko.observable<number>(15);
        this.allowItems = ko.observable<boolean>(true);
        this.minMatchmakingRaiting = ko.observable<number>(undefined);
        this.maxMatchmakingRaiting = ko.observable<number>(undefined);
        this.serverName = ko.observable<string>('AchtungLunne Server');

        this.allowSpectators = ko.observable<boolean>(true);
        this.localGameOnly = ko.observable<boolean>(true);
        this.players = ko.observableArray<CommonTypings.Player>();
        //this.playerHost: CommonTypings.Player;
        this.chat = ko.observableArray<string>(['Welcome to AchtungLunnez!']);
    }

    startGameClicked = () => {
        this.achtungTypescript.startLocalGame();
    };

    backToMainMenuClicked = () => {

    };

    getOptions() {
        return <CommonTypings.GameOptions>{
            roundsToWin: this.roundsToWin(),
            playerSize: this.playerSize(),
            playerSpeed: this.playerSpeed()
        };
    }

}
export = CustomGameSetup;