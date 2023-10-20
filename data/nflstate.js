const NFL_STATE_CACHE = {
    stats: undefined,
    proj: undefined,
    players: undefined,
    game_status: undefined
}

async function refreshNflStateCache() {
   return Promise.all([getStats(STATE.activeWeek),
        getProjections(STATE.activeWeek),
        getNflPlayers(),
        getNflStatus()])
        .then(results => {
            NFL_STATE_CACHE.stats = results[0]
            NFL_STATE_CACHE.proj = results[1]
            NFL_STATE_CACHE.players = results[2]
            NFL_STATE_CACHE.game_status = results[3]
        })
}

function statsForPlayerId(playerId) {
    if (NFL_STATE_CACHE.stats === undefined) {
        return undefined;
    }
    return NFL_STATE_CACHE.stats[playerId]
}

function projForPlayerId(playerId) {
    return NFL_STATE_CACHE.proj[playerId]
}

function infoForPlayerId(playerId) {
    return NFL_STATE_CACHE.players[playerId]
}

function getInjuryStatus(info) {
    switch (info.injury_status) {
        case "Sus":
        case "IR":
        case "NA":
        case "PUP":
        case "OUT":
        case "DNR":
        case "COV":
            return info.injury_status;
        case "Questionable":
            return "Q";
        case "Doubtful":
            return "D";
        default:
            return undefined
    }
}

function allGames() {
    let gameKeys = Object.keys(NFL_STATE_CACHE.game_status)
        .filter( key => NFL_STATE_CACHE.game_status[key].week === STATE.activeWeek);

    const games = []
    for (let key in gameKeys) {
        let game = NFL_STATE_CACHE.game_status[gameKeys[key]]
        games.push(game.home)
        games.push(game.away)
    }
    return games;
}

function ongoingGames(week) {
    let ongoingGameKeys = Object.keys(NFL_STATE_CACHE.game_status)
        .filter( key => {
            let game = NFL_STATE_CACHE.game_status[key];
            return game.week === STATE.activeWeek && game.status === "in_game"
        });

    const ongoingGames = []
    for (let key in ongoingGameKeys) {
        let game = NFL_STATE_CACHE.game_status[ongoingGameKeys[key]]
        ongoingGames.push(game.home)
        ongoingGames.push(game.away)
    }
    return ongoingGames;
}

function completedGames(week) {
    let completedGameKeys = Object.keys(NFL_STATE_CACHE.game_status)
        .filter( key => {
            let game = NFL_STATE_CACHE.game_status[key];
            return game.week === STATE.activeWeek && game.status === "complete"
        });

    const completedGames = []
    for (let key in completedGameKeys) {
        let game = NFL_STATE_CACHE.game_status[completedGameKeys[key]]
        completedGames.push(game.home)
        completedGames.push(game.away)
    }
    return completedGames;
}