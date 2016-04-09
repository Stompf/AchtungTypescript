declare module AchtungCommunication {

    interface LookingForGame {

    }

    interface GameFound {
        gameOptions: CommonTypings.GameOptions;
        players: Array<CommonTypings.Player>;
        playerID: string;
    }

    interface NewDirection {
        direction: CommonTypings.Direction;
    }

    interface StartGame {
        timeToStart: Date;
        mapBox: Array<CommonTypings.MapBox>;
    }

    interface PlayerReady {

    }

    interface ServerTick {
        tick: number;
        mapBox: Array<CommonTypings.MapBox>;
        players: Array<CommonTypings.Player>;
    }

    interface GameOver {
        mapBox: Array<CommonTypings.MapBox>;
        winner: CommonTypings.Player;
    }

    interface RoundOver {
        mapBox: Array<CommonTypings.MapBox>;
        winner: CommonTypings.Player;
        timeToNextRound: number;
    }
}