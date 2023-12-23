/*
    ===== 有关事件&提示的接口 =====
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
        hintText1.innerHTML = event.hintText;
        hintText2.innerHTML = event.hintText2 ? event.hintText2 : '';
    }
}

function tryAddEasterEggDescription(easterEggID, text) {
    const descriptionArea = document.querySelector('.text-container');
    let childs = descriptionArea.childNodes;
    for (var i = 0; i < childs.length; i++) {
        if (childs[i].name == easterEggID) {
            playErrorAnimation();
            return;
        }
    }

    const newLine = document.createElement('p');
    newLine.innerHTML = text;
    newLine.name = easterEggID;
    descriptionArea.appendChild(newLine);
}

function getNextEvent(input, event, id) {
    const specialNext = tryEventSpecialFunc(id, GetSpecialNextEvent, { input: input }, event.parent);
    if (specialNext) {
        return specialNext;
    }
    return event.nextEvent;
}

function getUseResult(input, event, id) {
    const nextEvent = getNextEvent(input, event, id);
    if (nextEvent == undefined) {
        return;
    }
    else if (nextEvent == "wrong") {
        playErrorAnimation();
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

function updateMoney(event) {
    if (event == undefined || event.newMoney == undefined){
        return;
    }
    money = event.newMoney;
    if (purseTitle != undefined){
        purseTitle.textContent = event.newMoney;
    }
    return;
}

function startEvent(eventId, options) {
    previousEventId = currentEventId;
    currentEventId = eventId;
    options = options ? options : {};

    const event = allEvents[eventId];
    if (event){
        tryEventSpecialFunc(eventId, GetSpecialOnEnter, { previousEvent: previousEventId }, event.parent);
    }

    const color = getColor(event, DATA_TYPES.Event);
    if (event && event.displayID)
        document.querySelector('.topic').innerHTML = event.displayID;
    else
        document.querySelector('.topic').innerHTML = eventId;

    document.querySelector('.topic').style.color = color;
    document.getElementsByClassName('text-container')[0].innerHTML = getDescription(eventId, DATA_TYPES.Event);

    // if innerHTML is empty, hide the text container
    if (document.getElementsByClassName('text-container')[0].innerHTML == '') {
        document.getElementsByClassName('text-container')[0].style.display = 'none';

        if (window.innerWidth > 768)
            document.querySelector('.main-container').style.justifyContent = 'center';
    }
    else {
        document.getElementsByClassName('text-container')[0].style.display = 'initial';
        document.querySelector('.text-container').style.height = 'auto';
    }

    // update event img
    if (allEvents[eventId] && allEvents[eventId].img) {
        document.querySelector('.img-wrapper').src = IMAGE_PATH + allEvents[eventId].img;
        document.querySelector('.img-container').style.display = 'flex';
    }
    else {
        document.querySelector('.img-container').style.display = 'none';
        document.querySelector('.text-container').style.marginLeft = 'auto';
        document.querySelector('.text-container').style.marginRight = 'auto';
    }

    document.getElementById('inputs').style.display = 'none';
    document.getElementById('outputs').style.display = 'none';

    updateMoney(event);

    setupHint(event);

    const hasLoot = setupLootArea(event, () => {
        setupInOutArea(event, eventId, color);
    });
    if (!hasLoot) {
        setupInOutArea(event, eventId, color);
    }
    if (event && event.loseCards != undefined) {
        loseCards(event.loseCards);
    }

}


/*
    ===== 特殊事件相关 =====
*/

function tryEventSpecialFunc(id, FuncArray, args, parent){
    if (FuncArray[id] != undefined && FuncArray[id](args) != undefined){
        return FuncArray[id](args);
    }
    else if (parent && FuncArray[parent] != undefined && FuncArray[parent](args) != undefined){
        return FuncArray[parent](args);
    }
    return undefined;
}

const GetSpecialEventDesc = {
    "sample-specialDesc": (args) => {
        if (branch.m && !branch.j) {
            return "你没有钱了，但是没有关系，你的输入框也没有了！";
        }
        else if (deck.includes("111")) {
            return "你有一张卡牌111";
        }
        return undefined;
    }
}

const GetSpecialNextEvent = {
    "15": (args) => {
        const input = args.input;
        if (input == "984" || input == "1302") {
            return input;
        }
        return "wrong";
    },
    "343": (args) => {
        const input = args.input;
        if (input == "1014" || input == "1091") {
            return input;
        }
        return "wrong";
    }
}

const GetSpecialOnEnter = {
    "2": (args) => {
        const previousEvent = args.previousEventId;

        switch (previousEvent) {
            case "3000-Dream":
                branch.d = true;
                break;
            case "3000-J":
                branch.j = true;
                break;
            default:
                return;
        }

        // 重置部分游戏状态
        money = "0";

        // 删除所有非天王卡
        let newDeck = [];
        deck.forEach( (id) => {
            if (allCards[id] && (allCards[id].color == "Boss" || allCards[id].color == "boss")) {
                newDeck.push(id);
            }
        } )
        deck = newDeck;
        refreshCardContainer();

        // 弹RAISA
        displayRAISA(previousEvent, "占位，你刚刚完成了" + previousEvent);
    }
}