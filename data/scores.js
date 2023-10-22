function updateScores() {
    STATE.scores = makeScores();
    updateScoresDom();
}

function makeScores() {
    if (STATE.matchUps == 0) {
        return {}
    }

    const currentMatchup = STATE.matchUps[STATE.activeMatchUp]

    let scoreObject = {}
    scoreObject[currentMatchup.gm1.user_id] = makeScoresForGm(currentMatchup.gm1)
    scoreObject[currentMatchup.gm2.user_id] = makeScoresForGm(currentMatchup.gm2)
    return scoreObject;
}

function makeScoresForGm(gm) {
    if (STATE.leagues[STATE.activeLeague].settings.best_ball === 1) {
        return makeBestBallScoresForGm(gm);
    } else {
        return makeRegularScoresForGm(gm);
    }
}

function makeRegularScoresForGm(gm) {
    let players = STATE.leagueRosters[gm.roster_id].starters
    let stat_sum = 0
    let proj_sum = 0
    const playersArray = []
    for (let i in players) {
        const playerId = players[i]
        if (playerId === "0") {
            playersArray.push(emptyPlayerObject())
            continue;
        }
        const stats = statsForPlayerId(playerId);
        const proj = projForPlayerId(playerId);
        const info = infoForPlayerId(playerId);
        const byeWeek = !(allGames().includes(info.team))
        const pregame = pregameGames(STATE.activeWeek).includes(info.team)
        const ongoing = ongoingGames(STATE.activeWeek).includes(info.team)
        const final = completedGames(STATE.activeWeek).includes(info.team)
        let playerObject = makePlayerObject(info,
            byeWeek || info.status === "Inactive" ? 0 : calculateStatsScore(stats, ongoing, final),
            byeWeek || info.status === "Inactive" ? 0 : calculateProjScore(proj),
            final,
            byeWeek,
            ongoing,
            pregame);
        stat_sum += playerObject.stat_score
        proj_sum += playerObject.proj_score
        playersArray.push(playerObject);
    }

    let bench = STATE.leagueRosters[gm.roster_id].players
        .filter(a => !players.includes(a))
    const benchArray = []
    for (let i in bench) {
        const playerId = bench[i]
        const stats = statsForPlayerId(playerId);
        const proj = projForPlayerId(playerId);
        const info = infoForPlayerId(playerId);
        const pregame = pregameGames(STATE.activeWeek).includes(info.team)
        const byeWeek = !(allGames().includes(info.team))
        const ongoing = ongoingGames(STATE.activeWeek).includes(info.team)
        const final = completedGames(STATE.activeWeek).includes(info.team)
        let playerObject = makePlayerObject(info,
            byeWeek || info.status === "Inactive" ? 0 : calculateStatsScore(stats, ongoing, final),
            byeWeek || info.status === "Inactive" ? 0 : calculateProjScore(proj),
            final,
            byeWeek,
            ongoing,
            pregame);
        benchArray.push(playerObject);
    }

    return {
        players: playersArray,
        bench: benchArray,
        stat_sum: stat_sum,
        proj_sum: proj_sum
    };
}

function makeBestBallScoresForGm(gm) {
    const players = STATE.leagueRosters[gm.roster_id].players
    const playersArray = []
    for (let i in players) {
        const playerId = players[i]
        const stats = statsForPlayerId(playerId);
        const proj = projForPlayerId(playerId);
        const info = infoForPlayerId(playerId);
        const byeWeek = !(allGames().includes(info.team))
        const pregame = pregameGames(STATE.activeWeek).includes(info.team)
        const ongoing = ongoingGames(STATE.activeWeek).includes(info.team)
        const final = completedGames(STATE.activeWeek).includes(info.team)
        let playerObject = makePlayerObject(info,
            calculateStatsScore(stats),
            calculateProjScore(proj),
            final,
            byeWeek,
            ongoing,
            pregame);
        playersArray.push(playerObject);
    }
    return bestBallSort(playersArray);
}

function calculateStatsScore(stats) {
    if (stats === undefined) {
        return 0
    }
    let scoring_settings = STATE.leagues[STATE.activeLeague].scoring_settings;
    let score = 0
    for (let type in stats) {
        if (type in scoring_settings) {
            score += stats[type] * scoring_settings[type];
        }
    }
    return score;
}

function calculateProjScore(proj) {
    if (proj === undefined) {
        return 0
    }
    let scoring_settings = STATE.leagues[STATE.activeLeague].scoring_settings;
    // console.log(proj)
    // console.log(scoring)
    let score = 0
    for (let type in proj) {
        if (type in scoring_settings) {
            score += proj[type] * scoring_settings[type];
        }
    }
    return score;
}

function emptyPlayerObject() {
    return {
        display_name: "empty",
        final: true,
        team: "empty",
        position: "empty",
        stat_score: 0,
        proj_score: 0,
        status: "Inactive",
        injury_status: undefined,
        team_bye: false,
        team_ongoing: false,
        team_pregame: false
    }
}

function makePlayerObject(info, statScore, projScore, isFinal, isByeWeek, isOngoing, isPregame) {
    let injury = getInjuryStatus(info)
    return {
        display_name: "{f}. {l}".replace("{f}", info.first_name.charAt(0))
            .replace("{l}", info.last_name),
        final: isFinal,
        team: info.team,
        position: info.position,
        stat_score: statScore,
        proj_score: projScore,
        status: info.status,
        injury_status: injury,
        team_bye: isByeWeek,
        team_ongoing: isOngoing,
        team_pregame: isPregame
    }
}

function positionsArray() {
    return STATE.leagues[STATE.activeLeague].roster_positions
}