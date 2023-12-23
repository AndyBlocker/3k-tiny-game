/*
    ===== 有关UI变化的接口 =====
*/

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getColor(data, dataType) {
    if (branch.j) {
        return CLINICAL_COLOR;
    }

    if (!data || !data.color) {
        if (dataType == DATA_TYPES.Event) {
            return EVENT_COLOR;
        }
        return getRandomColor();
    }

    let color = data.color;
    switch (color.toLowerCase()) {
        case "scp":
            return SCP_COLOR;
        case "props":
            return PROPS_COLOR;
        case "event":
            return EVENT_COLOR;
        case "boss":
            return BOSS_COLOR;
        default:
            return getRandomColor();
    }
}

function popAllChildElement(parent) {
    let childs = parent.childNodes;
    for (var i = childs.length - 1; i >= 0; i--) {
        parent.removeChild(childs[i]);
    }
}

// 绘制卡片详情窗口
function previewCard(cardId, options) {
    var cardData = allCards[cardId];
    var modal = document.getElementById('modal');
    var modalContent = modal.querySelector('.modal-content');

    modalContent.innerHTML = '<span class="close">&times;</span>';

    var titleDiv = document.createElement('div');
    if (cardId == PURSE_CARD_ID) {
        titleDiv.innerHTML = money;
    }
    else if (allCards[cardId] && allCards[cardId].displayID) {
        titleDiv.innerHTML = allCards[cardId].displayID;
    }
    else {
        titleDiv.innerHTML = cardId;
    }
    titleDiv.className = 'card-description-id';
    modalContent.appendChild(titleDiv);
    titleDiv.style.color = options.color;

    if (cardData && cardData.img) {
        var img = document.createElement('img');
        img.src = IMAGE_PATH + cardData.img;
        img.className = 'card-description-img';
        modalContent.appendChild(img);
    }

    var divider = document.createElement('div');
    divider.className = 'divider';
    modalContent.appendChild(divider);
    modalContent.style.borderColor = options.color;
    divider.style.backgroundColor = options.color;

    if (cardData && cardData.name) {
        var nameDiv = document.createElement('div');
        nameDiv.innerHTML = cardData.name;
        nameDiv.className = 'card-description-name';
        modalContent.appendChild(nameDiv);
    }

    var descriptionDiv = document.createElement('div');
    descriptionDiv.innerHTML = getDescription(cardId, DATA_TYPES.Card);
    descriptionDiv.className = 'card-description-text';
    modalContent.appendChild(descriptionDiv);

    modal.style.display = "flex";
    modalContent.style.display = "flex";

    var span = document.getElementsByClassName('close')[0];

    span.onclick = function () {
        modal.style.display = "none";
        modalContent.innerHTML = '';
        modalContent.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            modalContent.innerHTML = '';
            modalContent.style.display = "none";
        }
    }
}

function setupCardElement(cardDiv, cardId, options, cardTitle, cardImage){
    const card = allCards[cardId];
    options = options ? options : {};

    options.color = options.color ? options.color : getColor(card);
    cardDiv.style.borderColor = options.color;

    if (cardId == PURSE_CARD_ID) {
        cardTitle.textContent = money;
        purseTitle = cardTitle;
    }
    else if (card && card.displayID) {
        cardTitle.textContent = card.displayID;
    }
    else {
        cardTitle.textContent = cardId;
    }
    cardTitle.style.color = options.color;

    cardImage.src = (options && options.imageUrl) ? options.imageUrl : 
        (IMAGE_PATH + (card && card.img ? card.img : '585.png'));

    cardDiv.onclick = () => {
        previewCard(cardId, options);
    }
}

// 替换卡牌
function replaceCardInContainer(cardId, newId, options) {
    const cardDiv = document.getElementById(cardId);
    if (cardDiv == undefined){
        return;
    }
    cardDiv.id = newId;
    const cardTitle = cardDiv.getElementsByClassName('card-title')[0];
    const cardImage = cardDiv.getElementsByTagName('img')[0];
    setupCardElement(cardDiv, newId, options, cardTitle, cardImage);
}

// 将card绘制到container中
function addCardToContainer(cardId, options) {
    const cardDiv = document.createElement('div');
    cardDiv.id = cardId;
    cardDiv.classList.add('card');

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');
    cardDiv.appendChild(cardTitle);

    const cardImage = document.createElement('img');
    cardImage.classList.add('card-image');
    cardDiv.appendChild(cardImage);

    cardContainer.appendChild(cardDiv);

    setupCardElement(cardDiv, cardId, options, cardTitle, cardImage);
    fadeIn(cardDiv);
}

// 从container中删除card
function popCardFromContainer(container, cardId) {
    let childs = container.childNodes;
    for (var i = 0; i < childs.length; i++) {
        if (childs[i].id == cardId) {
            fadeOutAndRemove(childs[i]);
            return;
        }
    }
}

function updateCardVisibility() {
    const cardElements = cardContainer.querySelectorAll('.card');
    cardElements.forEach((card, index) => {
        if (index >= currentStartIndex && index < currentStartIndex + maxCardsToShow) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
    if (deck.length > maxCardsToShow) {
        document.querySelector('.prev-card').style.display = '';
        document.querySelector('.next-card').style.display = '';
    }
    else {
        document.querySelector('.prev-card').style.display = 'none';
        document.querySelector('.next-card').style.display = 'none';
    }
}

function addButtonToLootContainer(buttonPrompt, buttonClass, buttonFunction) {
    const button = document.createElement('button');
    button.classList.add(buttonClass);
    button.innerText = buttonPrompt;
    setTimeout(() => {
        button.onclick = () => {
            buttonFunction;
            button.classList.add('hidden-element');
            button.onclick = () => { };
            _lootToPick--;
            if (_lootToPick == 0) {
                setupInOutArea(event);
            }
        }
    }, 100);
    lootContainer.appendChild(button);
}

function addCardToLootContainer(cardId, divClass, callback) {
    const card = allCards[cardId];

    const cardDiv = document.createElement('button');
    cardDiv.innerText = "获得" + ((card && card.displayID) ? card.displayID : cardId);
    cardDiv.id = cardId;
    cardDiv.classList.add(divClass);

    let options = { "color": getColor(card), "imageUrl": (card && card.img) ? (IMAGE_PATH + card.img) : '' };
    cardDiv.style.borderColor = options.color;
    cardDiv.style.color = options.color;
    setTimeout(() => {
        cardDiv.onclick = () => {
            addCardToDeck(cardId, options);
            cardDiv.classList.add('hidden-element');
            cardDiv.onclick = () => { };

            _lootToPick--;
            if (_lootToPick == 0) {
                callback();
            }
        }
    }, 100);
    lootContainer.appendChild(cardDiv);
}

function setupLootArea_internal(cardList, callback) {
    if (cardList.length >= 2) {
        addCardToLootContainer(cardList[0], 'medium-button', callback);
        addCardToLootContainer(cardList[1], 'medium-button', callback);
        setupLootArea_internal(cardList.slice(2), callback);
    }
    else if (cardList.length == 1) {
        addCardToLootContainer(cardList[0], 'large-button', callback);
    }
    else {
        return;
    }
}

function setupLootArea(event, callback) {
    popAllChildElement(lootContainer);
    if (event == undefined || event.getCards == undefined) {
        return false;
    }
    const newCards = checkDeck(event.getCards);
    _lootToPick = newCards.length;
    if (_lootToPick == 0) {
        return false;
    }

    setupLootArea_internal(newCards, callback);
    return true;
}

function setupOutputArea(event, eventId, color) {
    if (event == undefined) {
        return;
    }
    popAllChildElement(document.getElementById('outputs'));
    let choices = [];
    if (event.choices != undefined) {
        choices = event.choices;
    }
    else {
        const nextEvent = getNextEvent('', event, eventId);
        choices.push({ nextEvent: nextEvent, buttonPrompt: event.buttonPrompt });
    }
    color = color ? color : getColor(event, DATA_TYPES.Event);
    for (var i = 0; i < choices.length; i++) {
        let choice = choices[i];
        if (choice.branch && branch[choice.branch]){
            // 该分支已经完成，不再显示按钮
            continue;
        }
        addOutputButton(choice.nextEvent, choice.buttonPrompt, color);
    }
}

function setupInputArea(event, eventId, color) {
    color = color ? color : getColor(event, DATA_TYPES.Event);
    const inputBox = document.querySelector('.input-box');
    const goButton = document.getElementById('go');
    const cal1 = document.querySelector(".cal-1");
    const cal2 = document.querySelector(".cal-2");
    const calc = document.querySelector('.calculater');

    document.querySelector(".plus").style.color = color;
    document.querySelector(".equal").style.color = color;
    inputBox.style.borderColor = color;
    goButton.style.borderColor = color;
    goButton.style.color = color;
    cal1.style.borderColor = color;
    cal2.style.borderColor = color;
    calc.style.borderColor = color;
    if (branch && branch.d)
        document.querySelector(".calculater").src = IMAGE_PATH + 'calc-white.png';    
    else
        document.querySelector(".calculater").src = IMAGE_PATH + (color == EVENT_COLOR ? 'calc-purple.png' : 'calc-red.png');
    if (branch && branch.d)
        document.querySelector("#go-img").src = IMAGE_PATH + 'arrow-white.png';
    else
        document.querySelector("#go-img").src = IMAGE_PATH + (color == EVENT_COLOR ? 'arrow-purple.png' : 'arrow-red.png');

    goButton.onclick = () => {
        const input = inputBox.value;
        getUseResult(input, event, eventId);
        inputBox.value = "";

        cal1.value = null;
        cal2.value = null;
    }
}

function playErrorAnimation() {
    triggerErrorAnimation(document.querySelector('.input-box'));
}

function addOutputButton(nextEventId, buttonPrompt, color) {
    if (nextEventId == undefined) {
        return;
    }

    const continueButton = document.createElement('button');
    continueButton.name = nextEventId;
    continueButton.classList.add('continue');
    continueButton.classList.add('large-button');
    continueButton.style.borderColor = color;
    continueButton.style.color = color;
    document.getElementById('outputs').appendChild(continueButton);

    continueButton.innerText = buttonPrompt ? buttonPrompt : DEFAULT_CONTINUE_TEXT;
    
    console.log(continueButton.style)
    setTimeout(() => continueButton.onclick = () => {
        startEvent(nextEventId);
    }, 100);
}

function setupInOutArea(event, eventId, color) {
    popAllChildElement(lootContainer);
    const isOutputType = event == undefined || (event.type != "input" && event.type != "Input");
    if (isOutputType || branch.m) {
        document.getElementById('outputs').style.display = 'initial';
        setupOutputArea(event, eventId, color);
    }
    else {
        document.getElementById('inputs').style.display = 'initial';
        setupInputArea(event, eventId, color);
    }
}

function triggerErrorAnimation(element) {
    element.classList.add("error-shake");

    element.addEventListener('animationend', () => {
        element.classList.remove("error-shake");
    });
}

function calcNumberOfCardToShow() {
    let screenWidth = window.innerWidth;
    let cardSize = 8 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    maxCardsToShow = Math.min(Math.floor(screenWidth / cardSize), 8);
    updateCardVisibility();
    console.log("maxCardsToShow: " + maxCardsToShow);
}

function displayRAISA(title, description) {
    var modal = document.getElementById('modal');
    var RAISA = modal.querySelector('.RAISA');

    var titleDiv = modal.querySelector('.RAISA-title');
    var descriptionDiv = modal.querySelector('.RAISA-description');

    titleDiv.textContent = title;
    descriptionDiv.innerHTML = description;

    modal.style.display = "flex";
    RAISA.style.display = "block";

    var span = RAISA.querySelector('.close');
    span.onclick = function () {
        modal.style.display = "none";
        RAISA.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            RAISA.style.display = "none";
        }
    }
}

/*
    ===== 计算器相关 =====
*/

function deployCalculater() {
    var calc = document.querySelector(".calculater");
    calc.onclick = () => {
        console.log(document.querySelector('.calculater-container').style.display);
        document.querySelector('.calculater-container').style.display = (document.querySelector('.calculater-container').style.display == "flex" ? "none" : "flex");
        // const classList = document.querySelector(".calculater-container").classList;
        // classList.contains("display") ? classList.remove("display") : classList.add("display");
    };

    const cal1 = document.querySelector(".cal-1");
    const cal2 = document.querySelector(".cal-2");
    cal1.onkeyup = calculate;
    cal2.onkeyup = calculate;

    function calculate() {
        var calcRes = parseInt(cal1.value) + parseInt(cal2.value);
        if (!isNaN(calcRes)) {
            document.querySelector(".button-area #inputs .input-box").value = calcRes;
        }
    }

}

function getFullDimensionsWithMargin(element) {
    var style = window.getComputedStyle(element);

    var widthWithMargin = element.offsetWidth
        + parseInt(style.marginLeft, 10)
        + parseInt(style.marginRight, 10);

    var heightWithMargin = element.offsetHeight
        + parseInt(style.marginTop, 10)
        + parseInt(style.marginBottom, 10);

    return { width: widthWithMargin, height: heightWithMargin };
}

function updateCalcWidth() {
    const inputBox = document.querySelector(".input-box");
    const calcContainer = document.querySelector(".calculater-container");
    const input_and_calc = document.querySelector(".input-and-calc-container");
    if (inputBox && calcContainer) {
        if (window.innerWidth > 768) {
            calcContainer.style.width = window.getComputedStyle(inputBox).width;
        }
        else {
            calcContainer.style.width = window.getComputedStyle(input_and_calc).width;
        }
    }

    console.log("input_box width: " + window.getComputedStyle(inputBox).width);
    console.log("calcContainer width: " + window.getComputedStyle(calcContainer).width);
}

function fadeIn(element) {
    element.classList.remove('fade-out');
    element.classList.add('fade-in');
}

function fadeOutAndRemove(element) {
    element.classList.add('fade-out');

    element.addEventListener('animationend', function () {
        element.remove();
    }, { once: true });
}
