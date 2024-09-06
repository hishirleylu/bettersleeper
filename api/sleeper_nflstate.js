const NFL_STATE_ENDPOINT = "https://api.sleeper.app/v1/state/nfl"
const NFL_PLAYERS_ENDPOINT = "https://api.sleeper.app/v1/players/nfl"
const STATS_ENDPOINT = "https://api.sleeper.app/v1/stats/nfl/regular/2023/{0}" // 0: week
const PROJECTIONS_ENDPOINT = "https://api.sleeper.app/v1/projections/nfl/regular/2024/{0}" // 0: week
const NFL_SCHEDULE_ENDPOINT = "https://api.sleeper.app/schedule/nfl/regular/2024"

async function getStats(week) {
    return apiCallOne(STATS_ENDPOINT, week);
}
async function getProjections(week) {
    return apiCallOne(PROJECTIONS_ENDPOINT, week);
}
async function getNflPlayers() {
    const response = await fetch(NFL_PLAYERS_ENDPOINT);
    return await response.json();
}

async function getNflStatus() {
    const response = await fetch(NFL_SCHEDULE_ENDPOINT);
    return await response.json()
}

async function getNflState() {
    const response = await fetch(NFL_STATE_ENDPOINT);
    return await response.json()
}
