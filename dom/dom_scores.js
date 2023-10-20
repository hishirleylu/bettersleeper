const ID_RANKING_OPTIONS = "ranking-options"

//region RANKING OPTION
function updateRankingOptionsDom() {
    let div = document.getElementById(ID_RANKING_OPTIONS);
    div.innerText = "";
    // add options
    if (STATE.leagues[STATE.activeLeague].settings.best_ball === 1) {
        div.appendChild(rankingOptionDiv())
    }
}

function rankingOptionDiv() {
    let div = domElement("div", [])
    for (let i in STATE.ranking) {
        let ranking = STATE.ranking[i];
        const classes = [CLASS_BOX_TITLE, CLASS_OPTION];
        if (i == STATE.activeRanking) { classes.push(CLASS_ACTIVE); }
        div.appendChild(rankingOptionTypeDiv(i, ranking.name, classes));
    }
    return div;
}

function rankingOptionTypeDiv(rankingIndex, rankingType, classes) {
    let div = domElementWithInnerText("div", classes, rankingType);
    div.addEventListener("click", function (){
        setActiveRanking(rankingIndex); updateRanking(); updateScores(); });
    return div;
}
//endregion

const ID_SCORES_HOME = "scores-home"
const ID_SCORES_CENTER = "scores-center"
const ID_SCORES_AWAY = "scores-away"

const CLASS_PLAYER_LEFT = "player-left"
const CLASS_PLAYER_RIGHT = "player-right"

const CLASS_PLAYER_NAME = "player-name"
const CLASS_PLAYER_FULL_NAME = "player-fullname"
const CLASS_PLAYER_DESC = "player-desc"
const CLASS_PLAYER_INJURY = "player-injury"
const CLASS_PLAYER_BYE = "player-bye"
const CLASS_PLAYER_INACTIVE = "player-inactive"
const CLASS_PLAYER_ONGOING = "player-ongoing"

const CLASS_PLAYER_POINTS = "player-points"
const CLASS_PLAYER_STATSCORE = "player-stat-score"
const CLASS_PLAYER_PROJSCORE = "player-predict-score"

const CLASS_POSITION = "position"
function updateScoresDom() {
    scoresClear();
    const gmIds = Object.keys(STATE.scores)
    if (gmIds.length === 0) {
        return;
    }
    scoresLeftRight(STATE.matchUps[STATE.activeMatchUp].gm1, STATE.scores[gmIds[0]], true)
    scoresCenter();
    scoresLeftRight(STATE.matchUps[STATE.activeMatchUp].gm2, STATE.scores[gmIds[1]], false)
}

function scoresClear() {
    const wrapper = document.getElementById(ID_SCORES_CENTER)
    wrapper.innerText = ""
    const home = document.getElementById(ID_SCORES_HOME)
    home.innerText = ""
    const away = document.getElementById(ID_SCORES_AWAY)
    away.innerText = ""
}

//region SCORES CENTER
function scoresCenter() {
    const wrapper = document.getElementById(ID_SCORES_CENTER)
    wrapper.appendChild(positionBoxDiv("BN", "VS"))

    wrapper.appendChild(domElement("div", [CLASS_SPACE]));

    let addedSpaceForBench = false;
    const positions = positionsArray()
    for (let i in positions) {
        if (!addedSpaceForBench && positions[i] === "BN") {
            addedSpaceForBench = true
            wrapper.appendChild(domElement("div", [CLASS_SPACE]));
        }
        wrapper.appendChild(positionBoxDiv(positions[i], positions[i]))
    }
}

function positionBoxDiv(positionClass, position) {
    const wrapper = domElement("div", [CLASS_BOX, CLASS_BOX_WRAPPER])
    const div = domElement("div", [CLASS_BOX])
    if (position === "FLEX") {
        div.appendChild(wrtDiv())
    } else if (position === "SUPER_FLEX") {
        div.appendChild(wrtqDiv())
    } else {
        div.appendChild(domElementWithInnerText("div",
            [CLASS_POSITION, CLASS_BOX_SUBTITLE,
                positionClass], position));
    }
    wrapper.appendChild(div);
    return wrapper;
}

function wrtDiv() {
    const div = domElement("div", [CLASS_POSITION, CLASS_BOX_SUBTITLE, "WRT"])
    div.appendChild(domElementWithInnerText("span", ["WR"], "W"));
    div.appendChild(domElementWithInnerText("span", ["RB"], "R"));
    div.appendChild(domElementWithInnerText("span", ["TE"], "T"));
    return div;
}

function wrtqDiv() {
    const div = domElement("div", [CLASS_POSITION, CLASS_BOX_SUBTITLE, "WRTQ"])
    div.appendChild(domElementWithInnerText("span", ["WR"], "W"));
    div.appendChild(domElementWithInnerText("span", ["RB"], "R"));
    div.appendChild(document.createElement("br"))
    div.appendChild(domElementWithInnerText("span", ["TE"], "T"));
    div.appendChild(domElementWithInnerText("span", ["QB"], "Q"));
    return div;
}
//endregion

function scoresLeftRight(gmObject, scores, isHomeTeam) {
    const div = document.getElementById(
        isHomeTeam ? ID_SCORES_HOME : ID_SCORES_AWAY);
    div.appendChild(gmBox(gmObject, isHomeTeam, scores.stat_sum, scores.proj_sum))

    div.appendChild(domElement("div", [CLASS_SPACE]));

    for (const i in scores.players) {
        let player = scores.players[i]
        div.appendChild(playerBox(player, isHomeTeam))
    }

    div.appendChild(domElement("div", [CLASS_SPACE]));

    for (const i in scores.bench) {
        let player = scores.bench[i]
        div.appendChild(playerBox(player, isHomeTeam))
    }

}

function gmBox(gmObject, isHomeTeam, stat, proj) {
    const leftRightClass = isHomeTeam ? CLASS_PLAYER_LEFT : CLASS_PLAYER_RIGHT;
    const div = domElement("div", [CLASS_BOX, leftRightClass])
    div.appendChild(playerNameDiv(gmObject.name, undefined, gmObject.team_name, undefined))
    div.appendChild(playerScoreDiv(stat, proj))
    return div;
}

function playerBox(player, isHomeTeam) {
    const leftRightClass = isHomeTeam ? CLASS_PLAYER_LEFT : CLASS_PLAYER_RIGHT;

    const div = domElement("div", [CLASS_BOX, leftRightClass])
    if (player.team_bye) {
        div.classList.add(CLASS_PLAYER_BYE)
    } else if (player.team_ongoing) {
        div.classList.add(CLASS_PLAYER_ONGOING)
    } else if (player.status === "Inactive") {
        div.classList.add(CLASS_PLAYER_INACTIVE)
    }
    const player_desc = (player.final ? "(Final) " : "") +
        player.team + " - " + player.position
    div.appendChild(playerNameDiv(player.display_name, player.injury_status, player_desc, player.team_bye))
    div.appendChild(playerScoreDiv(player.stat_score, player.proj_score))
    return div;
}

function playerNameDiv(name, status, desc, bye) {
    const div = domElement("div", [CLASS_PLAYER_NAME])

    let nameDiv = domElement("div", [CLASS_BOX_TITLE]);
    nameDiv.appendChild(domElementWithInnerText("span", [CLASS_PLAYER_FULL_NAME], name));
    if (status !== undefined) {
        nameDiv.appendChild(domElementWithInnerText("span", [CLASS_PLAYER_FULL_NAME, CLASS_PLAYER_INJURY], status))
    }
    div.appendChild(nameDiv)

    div.appendChild(domElement("div", [CLASS_CLEAR]))

    let descDiv = domElement("div", [CLASS_BOX_SUBTITLE]);
    descDiv.appendChild(domElementWithInnerText("span", [CLASS_PLAYER_DESC], desc));
    if (bye) {
        descDiv.appendChild(domElementWithInnerText("span", [CLASS_PLAYER_DESC, CLASS_PLAYER_BYE], "BYE"))
    }
    div.appendChild(descDiv)
    return div;
}

function playerScoreDiv(stat, proj) {
    const div = domElement("div", [CLASS_PLAYER_POINTS])
    div.appendChild(domElementWithInnerText("div", [CLASS_PLAYER_STATSCORE, CLASS_BOX_TITLE], formatNumber(stat)))
    div.appendChild(domElementWithInnerText("div", [CLASS_PLAYER_PROJSCORE, CLASS_BOX_SUBTITLE], formatNumber(proj)))
    return div;
}
