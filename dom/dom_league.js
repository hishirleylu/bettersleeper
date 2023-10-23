const CLASS_LEAGUE = "league";
const CLASS_LEAGUENAME = "league-name";
const CLASS_LEAGUEDESC = "league-desc"
const ID_LEAGUES_CONTENT = "leagues-content"
const ID_LEAGUEID = "league-{idx}";

function updateLeagueDom() {
    let leagues = document.getElementById(ID_LEAGUES_CONTENT);
    leagues.innerHTML = "";

    for (let i in STATE.leagues) {
        const leagueObj = STATE.leagues[i];
        const desc = "{0} players".replace("{0}", leagueObj.total_rosters)
        leagues.appendChild(makeLeagueDiv(i, leagueObj.name, desc, i == STATE.activeLeague));
    }
}

//region LEAGUE DIV
function makeLeagueDiv(leagueIndex, leagueName, leagueDesc, isActive) {
    const classes = [CLASS_LEAGUE, CLASS_BOX];
    if (isActive) { classes.push(CLASS_ACTIVE); }
    let div = leagueDiv(leagueIndex, classes);
    div.appendChild(leagueNameDiv(leagueName, [CLASS_LEAGUENAME, CLASS_BOX_TITLE]));
    div.appendChild(leagueDescDiv(leagueDesc, [CLASS_LEAGUEDESC, CLASS_BOX_SUBTITLE]))
    return div;
}

function leagueDiv(leagueIndex, classes) {
    let div = domElement("div", classes);
    div.id = ID_LEAGUEID.replace("{idx}", leagueIndex);
    div.addEventListener("click", async function (){
        setActiveLeague(leagueIndex); await updateLeague(); updateScores(); })
    return div;
}

function leagueNameDiv(leagueName, classes) {
    return domElementWithInnerText("div", classes, leagueName);
}

function leagueDescDiv(leagueDesc, classes) {
    return domElementWithInnerText("div", classes, leagueDesc);
}
//endregion