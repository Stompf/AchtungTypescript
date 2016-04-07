declare module CommonTypings {

    interface Player {
        id: string;
        color: string;
        position: CommonTypings.Vector2D;
        isAlive: boolean;
        holeState: boolean;
        lastHoleEnd: Date;
        direction: CommonTypings.Direction;
        score: number;
    }

    interface Vector2D {
        x: number;
        y: number;
    }

    interface Size {
        height: number;
        width: number;
    }

    interface GameVariables {
        playerSize: CommonTypings.Size;
        playerSpeed: number;
        tickLength: number;
        holeChancePrecent: number;
        holeInterval: number;
        maxHoleSize: number;
        minHoleSize: number;
    }

    interface BoundingBox {
        topRight: Vector2D;
        topLeft: Vector2D;
        bottomRight: Vector2D;
        bottomLeft: Vector2D;
    }

    interface MapBox {
        mapboxID: string;
        player: Player;
    }

    interface GameOptions {
        players: Array<CommonTypings.Player>;
        roundsToWin: number;
        playerSpeed: number;
        playerSize: CommonTypings.Size;
        tickLength: number;
        holeInterval: number;
        maxHoleSize: number;
        minHoleSize: number;
        holeChancePrecent: number;
    }

    const enum Direction {
        UP,
        DOWN,
        RIGHT,
        LEFT
    }
}