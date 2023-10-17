function domElementWithInnerText(tag, classes, innerText) {
    let div = document.createElement(tag);
    div.className = classes.join(" ");
    div.innerText = innerText;
    return div;
}

function domElement(tag, classes) {
    let div = document.createElement(tag);
    div.className = classes.join(" ");
    return div;
}

function formatNumber(number) {
    if (isNaN(number)) {
        return number;
    }
    return (Math.round(number * 100) / 100).toFixed(2);
}