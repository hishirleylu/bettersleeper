function setActiveMatchUp(index) {
    STATE.activeMatchUp = index;
}

async function updateMatchUps() {
    await fetchMatchUps()
        .then(results => {
            let matchUpObj = {}
            for (let i in results) {
                let result = results[i]
                if (!(result.matchup_id in matchUpObj)) {
                    matchUpObj[result.matchup_id] = []
                }
                matchUpObj[result.matchup_id].push(result.roster_id)
            }

            let matchUpArray = []
            for (let i in matchUpObj) {
                let matchUp = matchUpObj[i];
                let o = {}

                let rosterId = matchUp[0]
                let roster = STATE.leagueRosters[rosterId]
                let user = STATE.leagueUsers[roster.owner_id]
                let team_name = user.metadata.team_name
                if (team_name === undefined) {
                    team_name = "{0}'s team".replace("{0}", user.display_name)
                }
                o.gm1 = {
                    name: user.display_name,
                    team_name: team_name,
                    user_id: user.user_id,
                    roster_id: rosterId
                }

                rosterId = matchUp[1]
                roster = STATE.leagueRosters[rosterId]
                user = STATE.leagueUsers[roster.owner_id]
                team_name = user.metadata.team_name
                if (team_name === undefined) {
                    team_name = "{0}'s team".replace("{0}", user.display_name)
                }
                o.gm2 = {
                    name: user.display_name,
                    team_name: team_name,
                    user_id: user.user_id,
                    roster_id: rosterId
                }
                if (o.gm1.name.toLowerCase() === STATE.sleeper_username.toLowerCase() ||
                    o.gm2.name.toLowerCase() === STATE.sleeper_username.toLowerCase()) {
                    matchUpArray.unshift(o);
                } else {
                    matchUpArray.push(o);
                }
            }
            STATE.matchUps = matchUpArray;
        });
    updateMatchUpsDom();
}

function fetchMatchUps() {
    return getMatchUps(STATE.leagues[STATE.activeLeague].league_id, STATE.activeWeek)
}