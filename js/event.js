/*
    ===== 有关事件&提示的接口 =====
*/

/*
function getEventDescription(id) {
    const event = allEvents[id];
    if (event == undefined || event.description == undefined) {
        return "未找到事件信息！ID：" + id;
    }

    if (event.specialDescription && GetSpecialEventDesc[id] != undefined && GetSpecialEventDesc[id]() != undefined) {
        return GetSpecialEventDesc[id]();
    }
    if (branch.j && branch.m) {
        return event.descriptionNoJM;
    }
    else if (branch.m && event.descriptionNoM != undefined) {
        return event.descriptionNoM;
    }
    else if (branch.j && event.descriptionNoJ != undefined) {
        return event.descriptionNoJ;
    }
    else {
        return event.description;
    }
}

*/

function setupHint(event) {
    const hintPrompt = document.querySelector('.hintPrompt');
    const hintText = document.querySelector('.hintText');
    hintText.style.display = 'none';

    if (event == undefined || event.hintText == undefined) {
        hintPrompt.style.display = 'none';
    }
    else {
        hintPrompt.style.display = 'initial';
        hintText.innerText = event.hintText;
    }
}

function tryAddEasterEggDescription(easterEggID, text) {
    const descriptionArea = document.getElementById('event-description');
    let childs = descriptionArea.childNodes;
    for (var i = 0; i < childs.length; i++) {
        if (childs[i].name == easterEggID) {
            playErrorAnimation();
            return;
        }
    }

    const newLine = document.createElement('p');
    newLine.innerText = text;
    newLine.name = easterEggID;
    descriptionArea.appendChild(newLine);
}

function getUseResult(input, event) {
    if (event.nextEvent == undefined) {
        return;
    }
    const correctPrompt = event.correctPrompt;
    const easterEggPrompt = event.easterEggPrompt;

    if (correctPrompt == undefined ||
        correctPrompt == input ||
        (Array.isArray(correctPrompt) && correctPrompt.includes(input))) {
        startEvent(event.nextEvent);
    }
    else if (easterEggPrompt && easterEggPrompt[input] != undefined) {
        tryAddEasterEggDescription(input, easterEggPrompt[input]);
    }
    else {
        playErrorAnimation();
    }
}

function startEvent(eventId) {
    currentEventId = eventId;

    const event = allEvents[eventId];
    document.querySelector('.topic').innerText = eventId;
    document.getElementById('event-description').innerText = getDescription(eventId, DATA_TYPES.Event);
    document.getElementById('inputs').style.display = 'none';
    document.getElementById('outputs').style.display = 'none';

    setupHint(event);
    if (!setupLootArea(event)) {
        setupInOutArea(event);
    }
    if (event && event.loseCards != undefined) {
        loseCards(event.loseCards);
    }

}


/*
    ===== 特殊事件相关 =====
*/

var GetSpecialEventDesc = {
    "1": () => {
        if (branch.j && branch.l) {
            return "目前处于无爱J线";
        }
        else if (deck.includes("111")) {
            return "你有一张卡牌111";
        }
        return undefined;
    }
}