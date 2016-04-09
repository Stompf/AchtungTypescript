import collections = require('../collections');
import matchMakingOptions = require('./MatchMakingOptions');

class ServerMap {

    size: CommonTypings.Size;
    playerSize: CommonTypings.Size;
    mapBox: collections.Dictionary<string, CommonTypings.MapBox>;

    mapBoxPartsWidth: number;
    mapBoxPartsHeight: number;

    constructor() {
        this.playerSize = matchMakingOptions.playerSize;
        this.size = <CommonTypings.Size>{
            width: 1000,
            height: 600
        };

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

    movePlayer(player: CommonTypings.Player) {
        if (!player.isAlive) {
            return false;
        }

        switch (player.direction) {
            case CommonTypings.Direction.UP:
                player.position.y -= 1;
                break;
            case CommonTypings.Direction.DOWN:
                player.position.y += 1;
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

        if (player.position.x * this.playerSize.width >= this.size.width || player.position.x < 0 || player.position.y < 0 || player.position.y * this.playerSize.height >= this.size.height) {
            player.isAlive = false;
            return false;
        }

        const mapBoxId = this.toMapBoxId(player.position.x, player.position.y);
        const mapBox = this.mapBox.getValue(mapBoxId);
        if (mapBox == null) {
            if (!player.holeState) {
                this.mapBox.setValue(mapBoxId, <CommonTypings.MapBox>{
                    mapboxID: mapBoxId,
                    player: player
                });
            }
        } else {
            player.isAlive = false;
        }

        return true;
    }

    private initMapBox() {
        this.mapBox = new collections.Dictionary<string, CommonTypings.MapBox>();

        this.mapBoxPartsWidth = Math.floor(this.size.width / this.playerSize.width);
        this.mapBoxPartsHeight = Math.floor(this.size.height / this.playerSize.height);
    }
}

export = ServerMap;