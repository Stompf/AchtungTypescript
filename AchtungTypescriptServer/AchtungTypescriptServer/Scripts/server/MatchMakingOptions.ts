const matchMakingOptions = <CommonTypings.GameOptions>{
    playerSize: <CommonTypings.Size>{
        height: 15,
        width: 15
    },
    playerSpeed: 1350,
    tickLength: 50,
    holeInterval: 3000,
    maxHoleSize: 500,
    minHoleSize: 100,
    holeChancePrecent: 60,
    roundsToWin: 5 
};
export = matchMakingOptions;