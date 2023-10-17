const CLASS_MATCHUP = "match-up";
const CLASS_MATCHUPGM = "match-up-gm";
const CLASS_MATCHUPVS = "match-up-vs";

const ID_MATCHUPS = "match-ups";
const ID_MATCHUPIDX = "match-up-{idx}";

function updateMatchUpsDom() {
    let div = document.getElementById(ID_MATCHUPS);
    div.innerText = "";
    // label
    div.appendChild(domElementWithInnerText("div", [CLASS_TITLE], "Match-Ups"))

    // match-ups
    for (let i in STATE.matchUps) {
        const matchUp = STATE.matchUps[i];
        div.appendChild(matchUpDiv(i, matchUp.gm1.name, matchUp.gm2.name, i == STATE.activeMatchUp));
    }
}
function matchUpDiv(matchupIndex, gmName1, gmName2, isActive) {
    const classes = [CLASS_MATCHUP, CLASS_BOX];
    if (isActive) { classes.push(CLASS_ACTIVE); }
    let div = domElement("div", classes);

    div.id = ID_MATCHUPIDX.replace("{idx}", matchupIndex);
    div.appendChild(matchUpGmDiv(gmName1));
    div.appendChild(matchUpVsDiv());
    div.appendChild(matchUpGmDiv(gmName2));
    div.addEventListener("click", async function (){
        setActiveMatchUp(matchupIndex); await updateMatchUps();
        resetRanking(); updateRanking();
        updateScores(); })
    return div;
}
function matchUpGmDiv(gmName) {
    return domElementWithInnerText("div", [CLASS_MATCHUPGM, CLASS_BOX_TITLE], gmName);
}

function matchUpVsDiv() {
    return domElementWithInnerText("div", [CLASS_MATCHUPVS, CLASS_BOX_SUBTITLE], "- vs -");
}