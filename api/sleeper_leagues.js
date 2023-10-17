//region API ENDPOINTS
const USER_LEAGUES_ENDPOINT = "https://api.sleeper.app/v1/user/{0}/leagues/nfl/{1}"
const LEAGUE_USERS_ENDPOINT = "https://api.sleeper.app/v1/league/{0}/users";
const LEAGUE_ROSTERS_ENDPOINT = "https://api.sleeper.app/v1/league/{0}/rosters";
const WEEK_MATCHUPS_ENDPOINT = "https://api.sleeper.app/v1/league/{0}/matchups/{1}"
//endregion

//region API CALLS
async function getUserLeagues(userId, season) {
    return apiCallTwo(USER_LEAGUES_ENDPOINT, userId, season);
}

async function getLeagueUsers(leagueId) {
    return apiCallOne(LEAGUE_USERS_ENDPOINT, leagueId);
}

async function getLeagueRosters(leagueId) {
    return apiCallOne(LEAGUE_ROSTERS_ENDPOINT, leagueId);
}

async function getMatchUps(leagueId, week) {
    return apiCallTwo(WEEK_MATCHUPS_ENDPOINT, leagueId, week);
}