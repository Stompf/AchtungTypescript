class ClientMap {

    size: CommonTypings.Size;
    playerSize: CommonTypings.Size;

    constructor(width: number, height: number, playerSize: CommonTypings.Size) {
        this.size = <CommonTypings.Size>{
            width: width,
            height: height
        };
        this.playerSize = playerSize;
    }

}
export = ClientMap;