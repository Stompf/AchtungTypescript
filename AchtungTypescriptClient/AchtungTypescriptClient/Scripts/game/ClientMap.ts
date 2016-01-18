import collections = require('../collections');
import textArea = require('./TextArea');

class ClientMap {

    size: CommonTypings.Size;
    playerSize: CommonTypings.Size;
    mapBox: collections.Dictionary<string, CommonTypings.MapBox>;

    mapBoxPartsWidth: number;
    mapBoxPartsHeight: number;

    arrowImageUp: HTMLImageElement;
    arrowImageDown: HTMLImageElement;
    arrowImageLeft: HTMLImageElement;
    arrowImageRight: HTMLImageElement;

    constructor(width: number, height: number, playerSize: CommonTypings.Size) {
        this.size = <CommonTypings.Size>{
            width: width,
            height: height
        };
        this.playerSize = playerSize;
        this.initMapBox();
        this.initArrowImages();
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
        if (!player.isAlive) {
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

        if (player.position.x * this.playerSize.width >= this.size.width || player.position.x < 0 || player.position.y < 0 || player.position.y * this.playerSize.height >= this.size.height) {
            textArea.addText(player.color + ' deaded');
            player.isAlive = false;
            return false;
        }

        const mapBoxId = this.toMapBoxId(player.position.x, player.position.y);
        const mapBox = this.mapBox.getValue(mapBoxId);
        if (mapBox == null) {
            this.mapBox.setValue(mapBoxId, <CommonTypings.MapBox>{
                mapboxID: mapBoxId,
                player: player
            });
        } else {
            player.isAlive = false;
            textArea.addText(player.color + ' deaded');
        }

        return true;
    }

    private initArrowImages() {
        const arrowImageUp = new Image();
        arrowImageUp.src = 'Img/arrowUp.png';
        arrowImageUp.onload = () => {
            this.arrowImageUp = arrowImageUp;
        };

        const arrowImageDown = new Image();
        arrowImageDown.src = 'Img/arrowDown.png';
        arrowImageDown.onload = () => {
            this.arrowImageDown = arrowImageDown;
        };

        const arrowImageLeft = new Image();
        arrowImageLeft.src = 'Img/arrowLeft.png';
        arrowImageLeft.onload = () => {
            this.arrowImageLeft = arrowImageLeft;
        };

        const arrowImageRight = new Image();
        arrowImageRight.src = 'Img/arrowRight.png';
        arrowImageRight.onload = () => {
            this.arrowImageRight = arrowImageRight;
        };
    }

    private initMapBox() {
        this.mapBox = new collections.Dictionary<string, CommonTypings.MapBox>();

        this.mapBoxPartsWidth = Math.floor(this.size.width / this.playerSize.width);
        this.mapBoxPartsHeight = Math.floor(this.size.height / this.playerSize.height);
    }

    drawDirectionArrow(ctx: CanvasRenderingContext2D, direction: CommonTypings.Direction, playerPosition: CommonTypings.Vector2D) {
        let img: HTMLImageElement;

        const arrowPosition = <CommonTypings.Vector2D>{
            x: playerPosition.x * this.playerSize.width,
            y: playerPosition.y * this.playerSize.height
        };

        switch (direction) {
            case CommonTypings.Direction.UP:
                arrowPosition.y -= this.playerSize.height;
                img = this.arrowImageUp;
                break;
            case CommonTypings.Direction.DOWN:
                arrowPosition.y += this.playerSize.height;
                img = this.arrowImageDown;
                break;
            case CommonTypings.Direction.LEFT:
                arrowPosition.x -= this.playerSize.width;
                img = this.arrowImageLeft;
                break;
            case CommonTypings.Direction.RIGHT:
                arrowPosition.x += this.playerSize.width;
                img = this.arrowImageRight;
                break;
            default:
                break;
        }

        if (img != null) {
            ctx.drawImage(img, arrowPosition.x, arrowPosition.y, this.playerSize.width, this.playerSize.height);
        }
    }
}
export = ClientMap;