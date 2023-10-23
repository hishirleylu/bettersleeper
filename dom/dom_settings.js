const CLASS_SETTINGS_OPTIONS = "settings-options";
const ID_WEEK = "week";
const ID_WEEKNUM = "week-{idx}"


//region Week
function updateWeekDom() {
    let week = document.getElementById(ID_WEEK);
    week.innerText = "";
    // add options
    week.appendChild(weekOptionsDiv());
}

function weekOptionsDiv() {
    let div = domElement("div", [CLASS_SETTINGS_OPTIONS]);
    for (let i= 1; i < 18; i++) {
        if (i == 11) {
            div.appendChild(document.createElement("br"))
        }
        div.appendChild(makeWeekDiv(i, i));
    }
    return div;
}

function makeWeekDiv(weekIndex, weekLabel) {
    const classes = [CLASS_TITLE, CLASS_OPTION];
    if (weekIndex === STATE.activeWeek) { classes.push([CLASS_ACTIVE]); }
    return weekDiv(weekIndex, weekLabel, classes);
}

function weekDiv(weekIndex, weekLabel, classes) {
    let div = domElementWithInnerText("div", classes, weekLabel);
    div.id = ID_WEEKNUM.replace("{idx}", weekIndex);
    div.addEventListener("click", async function() {
        setActiveWeek(weekIndex); updateWeek(); setActiveMatchUp(0); await updateMatchUps();
        resetRanking(); updateRanking(); await refreshNflStateCache();
        updateScores(); })
    return div;
}
//endregion