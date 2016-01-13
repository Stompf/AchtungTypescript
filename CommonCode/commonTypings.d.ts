declare module CommonTypings {

    interface Player {
        id: string;
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
        boundingBox: BoundingBox;
        player: Player;
    }
}