const STATE = {
    sleeper_username: "",
    sleeper_userId: "",
    season: 0,

    leagues: [],
    activeLeague: 0,
    leagueUsers: {},
    leagueRosters: {},

    activeWeek: 0,
    calendarWeek: 0,

    matchUps: [],
    activeMatchUp: 0,

    ranking: [],
    activeRanking: 0,

    scores: {}
}

window.onload = async function() {
    await init();
    await refreshNflStateCache();
    activeLeagueFromUrl();
    await updateLeague();
    updateScores();
}

function activeLeagueFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    setActiveLeague(urlParams.has("activeLeague") ? urlParams.get("activeLeague") : 0);
}

async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    STATE.sleeper_username = urlParams.get('username');
    await Promise.all([getUserInfoByUsername(STATE.sleeper_username), getNflState()])
        .then(results => {
            STATE.sleeper_userId = results[0].user_id;
            STATE.season = results[1].season;
            STATE.calendarWeek = results[1].display_week;
            STATE.activeWeek = results[1].display_week;
        })
}