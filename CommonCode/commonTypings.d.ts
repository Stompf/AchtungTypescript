declare module CommonTypings {

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
}