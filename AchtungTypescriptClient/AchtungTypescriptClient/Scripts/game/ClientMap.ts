import collections = require('../collections');

class ClientMap {

    size: CommonTypings.Size;
    playerSize: CommonTypings.Size;
    mapBox: collections.Dictionary<string, CommonTypings.MapBox>;

    mapBoxPartsWidth: number;
    mapBoxPartsHeight: number;

    constructor(width: number, height: number, playerSize: CommonTypings.Size) {
        this.size = <CommonTypings.Size>{
            width: width,
            height: height
        };
        this.playerSize = playerSize;
        this.initMapBox();
    }

    reset() {
        this.initMapBox();
    }

    toMapBoxId(x: number, y: number) {
        return x + '_' + y;
    }

    mapBoxIdToVector2D(id: string) {
        const split = id.split('_');
        return <CommonTypings.Vector2D>{
            x: Number(split[0]),
            y: Number(split[1])
        };
    }

    getRandomPosition(padding?: number) {
        const x = Math.floor(Math.random() * this.mapBoxPartsWidth - padding) + padding;
        const y = Math.floor(Math.random() * this.mapBoxPartsHeight - padding) + padding;
        return <CommonTypings.Vector2D>{
            x: x,
            y: y
        };
    }

    draw(ctx: CanvasRenderingContext2D, deltaTick: number) {
        this.mapBox.keys().forEach(key => {
            const vector2D = this.mapBoxIdToVector2D(key);
            const mapBox = this.mapBox.getValue(key);
            ctx.fillStyle = mapBox.player.color;
            ctx.fillRect(vector2D.x * this.playerSize.width, vector2D.y * this.playerSize.height, this.playerSize.width, this.playerSize.height);
        });
    }

    movePlayer(player: CommonTypings.Player) {
        if (!player.isAlive || player.position.x > this.mapBoxPartsWidth || player.position.x < 0 || player.position.y < 0 || player.position.y > this.mapBoxPartsHeight) {
            return false;
        }

        switch (player.direction) {
            case CommonTypings.Direction.UP:
                player.position.y += 1;
                break;
            case CommonTypings.Direction.DOWN:
                player.position.y -= 1;
                break;
            case CommonTypings.Direction.LEFT:
                player.position.x -= 1;
                break;
            case CommonTypings.Direction.RIGHT:
                player.position.x += 1;
                break;
            default:
                break;
        }

        if (player.position.x > this.mapBoxPartsWidth || player.position.x < 0 || player.position.y < 0 || player.position.y > this.mapBoxPartsHeight) {
            player.isAlive = false;
            return false;
        }

        const mapBoxId = this.toMapBoxId(player.position.x, player.position.y);
        const mapBox = this.mapBox.getValue(mapBoxId);
        if (mapBox == null) {
            this.mapBox.setValue(mapBoxId, <CommonTypings.MapBox>{
                player: player
            });
        } else {
            player.isAlive = false;
        }

        return true;
    }

    private initMapBox() {
        this.mapBox = new collections.Dictionary<string, CommonTypings.MapBox>();

        this.mapBoxPartsWidth = Math.floor(this.size.width / this.playerSize.width);
        this.mapBoxPartsHeight = Math.floor(this.size.height / this.playerSize.height);

        /*for (let x = 0; x < this.mapBoxPartsWidth; x++) {
            for (let y = 0; y < this.mapBoxPartsHeight; y++) {
                this.mapBox.setValue(this.toMapBoxId(x, y), <CommonTypings.MapBox>{});
            }
        }*/
    }
}
export = ClientMap;