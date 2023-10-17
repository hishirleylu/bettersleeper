function setActiveWeek(index) {
    STATE.activeWeek = index;
}

async function resetWeek() {
    await getNflState()
        .then(result => {
            STATE.activeWeek = result.display_week;
        })
}

function updateWeek() {
    updateWeekDom();
}