function bestBallSort(players) {
    let playersSorted = []
    let benchSorted = []
    let ineligible = []
    let proj_sum = 0
    let stat_sum = 0
    for (let i in STATE.leagues[STATE.activeLeague].roster_positions) {
        let position = STATE.leagues[STATE.activeLeague].roster_positions[i]
        let positions = [position]
        if (position === "FLEX") {
            positions = ["RB","WR","TE"]
        } else if (position === "SUPER_FLEX" || position === "BN") {
            positions = ["QB","RB","WR","TE", "K", "DEF"]
        }
        let highestIndex = getHighestForPositions(players, positions, ineligible);
        ineligible.push(highestIndex)
        let player = players[highestIndex];
        if (position === "BN") {
            benchSorted.push(player)
        } else {
            playersSorted.push(player)
        }
        if (position !== "BN") {
            let projScore = isNaN(player.proj_score) ? 0 : player.proj_score;
            let statScore = isNaN(player.stat_score) ? 0 : player.stat_score;
            proj_sum += statScore > projScore ? statScore : projScore;
            stat_sum += statScore;
        }
    }
    return { players: playersSorted, bench: benchSorted,stat_sum: stat_sum, proj_sum: proj_sum }
}

function getHighestForPositions(players, positions, ineligible) {
    let possiblePlayers = Object.keys(players)
        .filter(function (a) {
            return positions.includes(players[a].position) && !ineligible.includes(a);
        });
    return possiblePlayers
        .reduce(function(a, b) {
            return getScoreForPlayer(players[a]) > getScoreForPlayer(players[b]) ? a : b;
        });
}

function getScoreForPlayer(player) {
    // use stats
    if (STATE.activeRanking == 1) {
        return player.stat_score;
    }
    // use projections
    // - game is final
    if (player.final) {
        return player.stat_score
    }

    return Math.max(player.proj_score, player.stat_score)
}
