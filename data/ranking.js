//region Ranking Option
function setActiveRanking(index) {
    STATE.activeRanking = index;
}

function resetRanking() {
    STATE.activeRanking = STATE.activeWeek < STATE.calendarWeek ? 1 : 0;
}

function updateRanking() {
    STATE.ranking = makeRankingArray();
    updateRankingOptionsDom();
}

function makeRankingArray() {
    return [{
        name: "projections"
    },{
        name: "stats"
    }];
}
//endregion