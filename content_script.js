console.log("entered content script");

// https://stackoverflow.com/questions/16662393/insert-html-into-text-node-with-javascript

window.imageUrl = chrome.runtime.getURL("img/dropbox.svg");
window.logoSpan = `<span> <img class="injected_ylide_logo" src=${imageUrl} style="width:24px; height:24px; cursor:pointer"/> </span>`
// window.logoSpan = `<span class="injected_ylide_logo"> uWu </span>`
window.addressRegex = /0x[^\s]*/gm;



async function replaceOnDocument() {

    let finalArray = [...document.querySelectorAll("*:not(script):not(noscript):not(style)")]
        .map(node => [...node.childNodes])
        .flat()
        .filter((node) => {
            let isTreeNode = node.nodeType === 3;
            if (!isTreeNode){return false}
            let isPatternMatched = matchPattern(node.nodeValue);
            if (!isPatternMatched) {return false}
            let isLogoAlreadyAdded = node.parentElement.innerHTML.includes("injected_ylide_logo")
            if (isLogoAlreadyAdded) {return false}
                     
            console.log("(unaltered) text found")
            return isTreeNode && isPatternMatched;
        })

    console.log(finalArray)

    finalArray.forEach((textNode) => textNodeInnerHTML(textNode))
};



function textNodeInnerHTML(textNode) {
    let matchedString = getMatchedString(textNode.nodeValue)
    // let matchedString = "iOS"
    var div = document.createElement('div');
    textNode.parentNode.insertBefore(div, textNode);
    div.insertAdjacentHTML('afterend', textNode.data.replace(matchedString, matchedString + window.logoSpan));
    console.log("REPLACED")
    div.remove();
    textNode.remove();

}

function getMatchedString(textNodeValue) {

    let str = textNodeValue;
    let regex = window.addressRegex;
    let allMatches = []

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`);
            allMatches.push(match)
        });
    }

    return allMatches[0];
}

function matchPattern(textNodeValue) {
    let str = textNodeValue;
    let regex = window.addressRegex;
    let found = false

    while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
            console.log(`matched`);
            // stop on first match and return true
            found = true;
            return
        });

        if (found) {
            return true
        }
    }

    return false;
}

replaceOnDocument()