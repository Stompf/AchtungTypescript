class ClientMap {

    size: CommonTypings.Size;
    playerSize: CommonTypings.Size;
    mapBox: Array<CommonTypings.MapBox>;

    constructor(width: number, height: number, playerSize: CommonTypings.Size) {
        this.size = <CommonTypings.Size>{
            width: width,
            height: height
        };
        this.playerSize = playerSize;
        this.mapBox = new Array<CommonTypings.MapBox>();
    }

}
export = ClientMap;