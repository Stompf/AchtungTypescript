declare module CommonTypings {

    interface Player {
        id: string;
        color: string;
        position: CommonTypings.Vector2D;
        isAlive: boolean;
        direction: CommonTypings.Direction;
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
    }

    interface BoundingBox {
        topRight: Vector2D;
        topLeft: Vector2D;
        bottomRight: Vector2D;
        bottomLeft: Vector2D;
    }

    interface MapBox {
        player: Player;
    }

    const enum Direction {
        UP,
        DOWN,
        RIGHT,
        LEFT
    }
}