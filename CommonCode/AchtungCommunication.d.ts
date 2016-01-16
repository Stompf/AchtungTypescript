declare module AchtungCommunication {

    interface LookingForGame {

    }

    interface GameFound {
        gameVariables: CommonTypings.GameVariables;
        players: Array<CommonTypings.Player>;
    }

    interface NewDirection {
        direction: CommonTypings.Direction;
    }

    interface ServerTick {
        mapBox: Array<CommonTypings.MapBox>; 
    }
}