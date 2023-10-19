function setActiveLeague(index) {
    STATE.activeLeague = index;
}
function resetActiveLeague() {
    STATE.activeLeague = 0;
}
async function updateLeague() {
    await fetchLeagues();
    updateLeagueDom();
    await fetchActiveLeagueInfo();
    await resetWeek(); updateWeek();
    resetMatchUps(); await updateMatchUps();
    resetRanking(); updateRanking();
    updateScores();
}

async function fetchLeagues() {
    await getUserLeagues(STATE.sleeper_userId, STATE.season)
        .then(leagues => STATE.leagues = leagues.filter(league => (league.status === "in_season")));
}

function fetchActiveLeagueInfo() {
    return Promise.all([getLeagueUsers(STATE.leagues[STATE.activeLeague].league_id),
        getLeagueRosters(STATE.leagues[STATE.activeLeague].league_id)])
        .then(results => {
            const leagueUsers = results[0]
            STATE.leagueUsers = {}
            for (let i in leagueUsers) {
                let leagueUser = leagueUsers[i]
                STATE.leagueUsers[leagueUser.user_id] = leagueUser
            }

            const leagueRosters = results[1]
            STATE.leagueRosters = {}
            for (let i in leagueRosters) {
                let leagueRoster = leagueRosters[i]
                STATE.leagueRosters[leagueRoster.roster_id] = leagueRoster
            }
        })
}