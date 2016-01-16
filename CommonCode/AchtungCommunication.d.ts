﻿declare module AchtungCommunication {

    interface LookingForGame {

    }

    interface GameFound {
        gameVariables: CommonTypings.GameVariables;
        players: Array<CommonTypings.Player>;
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
    }

    interface GameOver {
        mapBox: Array<CommonTypings.MapBox>;
        winner: CommonTypings.Player;
    }
}