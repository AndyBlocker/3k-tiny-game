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
    const hintPrompt1 = document.getElementById('hintPrompt1');
    const hintPrompt2 = document.getElementById('hintPrompt2');
    hintText1.style.display = 'none';
    hintPrompt2.style.display = 'none';
    hintText2.style.display = 'none';

    if (event == undefined || event.hintText == undefined) {
        hintPrompt1.style.display = 'none';
    }
    else {
        hintPrompt1.style.display = 'initial';
        hintText1.innerText = event.hintText;
        hintText2.innerText = event.hintText2 ? event.hintText2 : '';
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

function getNextEvent(input, event, id) {
    if (event.specialNextEvent && GetSpecialNextEvent[id] != undefined && GetSpecialNextEvent[id](input) != undefined) {
        return GetSpecialNextEvent[id](input);
    }
    return event.nextEvent;
}

function getUseResult(input, event, id) {
    const nextEvent = getNextEvent(input, event, id);
    if (nextEvent == undefined) {
        return;
    }
    const correctPrompt = event.correctPrompt;
    const easterEggPrompt = event.easterEggPrompt;

    if (correctPrompt == undefined ||
        correctPrompt == input ||
        (Array.isArray(correctPrompt) && correctPrompt.includes(input))) {
        startEvent(nextEvent);
    }
    else if (easterEggPrompt && easterEggPrompt[input] != undefined) {
        tryAddEasterEggDescription(input, easterEggPrompt[input]);
    }
    else {
        playErrorAnimation();
    }
}

function getEventImg(eventId) {
    let url = IMAGE_PATH;
    if(allEvents[eventId] && allEvents[eventId].img){
        url += allEvents[eventId].img;
    }
    else{
        url += "default.jpg";
    }
}

function startEvent(eventId) {
    currentEventId = eventId;

    const event = allEvents[eventId];
    if (event){
        if (event.specialOnEnter && GetSpecialOnEnter[eventId]){
            GetSpecialOnEnter[eventId]();
        }
    }

    const color = getColor(event, DATA_TYPES.Event);
    document.querySelector('.topic').innerText = eventId;
    document.querySelector('.topic').style.color = color;
    document.getElementsByClassName('text-container')[0].innerText = getDescription(eventId, DATA_TYPES.Event);

    if (allEvents[eventId] && allEvents[eventId].img) {
        document.querySelector('img-wrapper').src = IMAGE_PATH + allEvents[eventId].img;
        document.querySelector('img-wrapper').style.display = 'initial';
    }
    else {
        document.querySelector('img-wrapper').style.display = 'none';
    }

    document.getElementById('inputs').style.display = 'none';
    document.getElementById('outputs').style.display = 'none';

    setupHint(event);
    if (!setupLootArea(event)) {
        setupInOutArea(event, eventId);
    }
    if (event && event.loseCards != undefined) {
        loseCards(event.loseCards);
    }

}


/*
    ===== 特殊事件相关 =====
*/

var GetSpecialEventDesc = {
    "sample-specialDesc": () => {
        if (branch.m && !branch.j) {
            return "你没有钱了，但是没有关系，你的输入框也没有了！";
        }
        else if (deck.includes("111")) {
            return "你有一张卡牌111";
        }
        return undefined;
    }
}

var GetSpecialNextEvent = {
    "sample-specialDesc": (input) => {
        if (branch.m && !branch.j) {
            return "sample-variant";
        }
        return undefined;
    }
}

var GetSpecialOnEnter = {
    "2": () => {
        let newDeck = [];
        deck.forEach( (id) => {
            if (allCards[id] && (allCards[id].color == "Boss" || allCards[id].color == "boss")) {
                newDeck.push(id);
            }
        } )
        deck = newDeck;
        refreshCardContainer();
    }
}