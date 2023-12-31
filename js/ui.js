/*
    ===== 有关UI变化的接口 =====
*/

function switchToNoDream() {
    document.querySelector('.content').classList.add("no-dream");
    document.querySelector('.modal').classList.add("no-dream");
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[getRandNumber(16)];
    }
    return color;
}

function getColor(data, dataType) {
    if (branch.d) {
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

function prefetchNextImg(event, eventId) {
    if (event == undefined) {
        return;
    }
    const nextEvent = getNextEvent(undefined, event, eventId);
    if (nextEvent && allEvents[nextEvent] && allEvents[nextEvent].img) {
        let img = new Image();
        img.src = IMAGE_PATH + allEvents[nextEvent].img;
    }
    if (event.getCards) {
        const newCards = checkDeck(event.getCards);
        for (const id of newCards) {
            if (allCards[id] && allCards[id].img) {
                let img = new Image();
                img.src = IMAGE_PATH + allCards[id].img;
            }
        }
    }
}

let _lastTouchCoords = { x: 0, y: 0 };

function nullHandler(e) {
    e.preventDefault();
}

function getEventCoordinates(e) {
    if (e.type.startsWith('touch')) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
        return { x: e.pageX, y: e.pageY };
    }
}

function updateLastTouchClientCoords(e){
    if (e.type.startsWith('touch')) {
        _lastTouchCoords = { x: e.touches[0].clientX, y: e.touches[0].clientY }; // 更新触摸坐标
    }
}

function initCardDrag() {
    function moveHandler(e) {
        if (!_dragging || !_dragElement) {
            return;
        }
        const coords = getEventCoordinates(e);
        updateLastTouchClientCoords(e);
        _dragElement.style.left = coords.x - _dragOffset.X + 'px';
        _dragElement.style.top = coords.y - _dragOffset.Y + 'px';
    }

    function endHandler(e) {
        if (!_dragging || !_dragElement) {
            return;
        }

        const coords = e.type === 'touchend' ? 
            { x: _lastTouchCoords.x, y: _lastTouchCoords.y } : 
            { x: e.clientX, y: e.clientY };

        const dropTarget = document.elementFromPoint(coords.x, coords.y);

        if (dropTarget.type == 'text') {
            dropTarget.value = _dragValue;
            if (!dropTarget.classList.contains('input-box')) {
                calculate();
            }   
        }
        else {
            console.log("not in");
            console.log(dropTarget)
            console.log(coords);
        }

        _dragging = false;
        _dragElement.parentNode.removeChild(_dragElement);
        _dragElement.remove();
        document.removeEventListener('selectstart', nullHandler);
        _dragOffset = { X: 0, Y: 0 };
        _dragElement = undefined;
        _dragValue = '';
    }

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', endHandler);
    document.addEventListener('touchmove', moveHandler);
    document.addEventListener('touchend', endHandler);
}

function registerDraggable(element, value) {
    function startHandler(e) {
        e.preventDefault();
        const coords = getEventCoordinates(e);
        updateLastTouchClientCoords(e);

        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        const offsetX = e.type.startsWith('touch') ? coords.x - (element.getBoundingClientRect().left + scrollX) : e.offsetX;
        const offsetY = e.type.startsWith('touch') ? coords.y - (element.getBoundingClientRect().top + scrollY) : e.offsetY;

        const dragElement = element.cloneNode(true);
        dragElement.id = element.id + '-drag';
        dragElement.display = 'block';
        dragElement.classList.add('card-drag');
        dragElement.style.position = 'absolute';
        dragElement.style.left = (coords.x - offsetX) + 'px';
        dragElement.style.top = (coords.y - offsetY) + 'px';
        _dragOffset.X = offsetX;
        _dragOffset.Y = offsetY;
        document.querySelector('.card-wrapper').appendChild(dragElement);
        console.log(dragElement);
        _dragElement = dragElement;
        _dragging = true;
        _dragValue = value;
        _dragStartTime = e.timeStamp;
        document.addEventListener('selectstart', nullHandler);
    }

    element.addEventListener('mousedown', startHandler);
    element.addEventListener('touchstart', startHandler);
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
    titleDiv.innerHTML = getCardTitle(cardId);
    titleDiv.className = 'card-description-id';
    modalContent.appendChild(titleDiv);
    titleDiv.style.color = options.color;

    if (!branch.d && cardData && cardData.img) {
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

    modal.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            modalContent.innerHTML = '';
            modalContent.style.display = "none";
        }
    }
}

function setupCardElement(cardDiv, cardId, options, cardTitle, cardImage, cardName) {
    const card = allCards[cardId];
    options = options ? options : {};

    options.color = options.color ? options.color : getColor(card, DATA_TYPES.Card);
    cardDiv.style.borderColor = options.color;

    const title = getCardTitle(cardId)
    cardTitle.textContent = title;
    cardTitle.style.color = options.color;

    if (!branch.d) {
        cardImage.src = (options && options.imageUrl) ? options.imageUrl : (IMAGE_PATH + (card && card.img ? card.img : '585.png'));
        cardName.style.display = "none";
    }
    else if (card && card.name) {
        cardName.innerHTML = card.name;
        cardImage.style.display = "none";
    }

    clickHandler = (e) => {
        if (e.timeStamp - _dragStartTime < DRAG_THRESHOLD) {
            previewCard(cardId, options);
        }
    }  
    cardDiv.onclick = clickHandler;
    cardDiv.addEventListener('touchend', clickHandler);
    registerDraggable(cardDiv, title);
}

// 替换卡牌
function replaceCardInContainer(cardId, newId, options) {
    const cardDiv = document.getElementById(cardId);
    if (cardDiv == undefined) {
        return;
    }
    cardDiv.id = newId;
    const cardTitle = cardDiv.getElementsByClassName('card-title')[0];
    const cardImage = cardDiv.getElementsByTagName('img')[0];
    const cardName = cardDiv.getElementsByClassName('card-description-name')[0];
    setupCardElement(cardDiv, newId, options, cardTitle, cardImage, cardName);
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

    const cardName = document.createElement('div');
    cardName.className = 'card-description-name';
    cardDiv.appendChild(cardName);

    cardContainer.appendChild(cardDiv);

    setupCardElement(cardDiv, cardId, options, cardTitle, cardImage, cardName);
    fadeIn(cardDiv);
}

// 从container中删除card
function popCardFromContainer(container, cardId) {
    let childs = container.childNodes;
    for (var i = childs.length-1; i >= 0; i--) {
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

    let options = { "color": getColor(card, DATA_TYPES.Card), "imageUrl": (card && card.img) ? (IMAGE_PATH + card.img) : '' };
    setTextAndBorderColor(cardDiv, options.color);
    setTimeout(() => {
        cardDiv.onclick = () => {
            // console.log(cardId);
            // console.log(deck);
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
        const nextEvent = getNextEvent(undefined, event, eventId);
        choices.push({ nextEvent: nextEvent, buttonPrompt: event.buttonPrompt });
    }
    color = color ? color : getColor(event, DATA_TYPES.Event);
    for (var i = 0; i < choices.length; i++) {
        let choice = choices[i];
        if (choice.branch && branch[choice.branch]) {
            // 该分支已经完成，不再显示按钮
            continue;
        }
        addOutputButton(choice.nextEvent, choice.buttonPrompt, color);
    }
}

function setTextAndBorderColor(element, color) {
    element.style.borderColor = color;
    element.style.color = color;
}

function setImageColor(element, color, whiteSrc, purpleSrc, redSrc) {
    if (branch && branch.d)
        element.src = IMAGE_PATH + whiteSrc;
    else
        element.src = IMAGE_PATH + (color == EVENT_COLOR ? purpleSrc : redSrc);
}

function setupInputArea(event, eventId, color) {
    color = color ? color : getColor(event, DATA_TYPES.Event);
    const inputBox = document.getElementById('input-box');
    const goButton = document.getElementById('go');
    const cal1 = document.querySelector(".cal-1");
    const cal2 = document.querySelector(".cal-2");
    const calc = document.querySelector('.calculater');

    setCalculaterVisibility(!event.hideCalculater);
    cal1.value = getCal1DefaultText(event, eventId);

    for (const e of [inputBox, cal1, cal2, calc]) { e.style.borderColor = color; };
    setTextAndBorderColor(goButton, color);
    document.querySelector(".plus").style.color = color;
    document.querySelector(".equal").style.color = color;

    setImageColor(calc, color, 'calc-white.png', 'calc-purple.png', 'calc-red.png');
    setImageColor(document.querySelector("#go-img"), color, 'arrow-white.png', 'arrow-purple.png', 'arrow-red.png');

    goButton.onclick = () => {
        const input = inputBox.value;
        inputBox.value = "";
        cal1.value = getCal1DefaultText(event, eventId);
        cal2.value = null;
        getUseResult(input, event, eventId);
    }
}

function playErrorAnimation(inputBox) {
    triggerErrorAnimation(inputBox);
}

function addOutputButton(nextEventId, buttonPrompt, color) {
    if (nextEventId == undefined) {
        return;
    }

    const continueButton = document.createElement('button');
    continueButton.name = nextEventId;
    continueButton.classList.add('continue');
    continueButton.classList.add('large-button');
    setTextAndBorderColor(continueButton, color);
    document.getElementById('outputs').appendChild(continueButton);

    continueButton.innerText = buttonPrompt ? buttonPrompt : DEFAULT_CONTINUE_TEXT;

    // console.log(continueButton.style)
    setTimeout(() => continueButton.onclick = () => {
        console.log(buttonPrompt);
        console.log(deck);
        startEvent(nextEventId);
    }, 100);
}

//  inputBoxes: htmlCollection
function getMultipleInputsUseResult(event, inputBoxes) {
    if (event == undefined) {
        return false;
    }
    let inputs = [];
    let result = true;
    const correctPrompt = event.correctPrompt;
    const easterEggPrompt = event.easterEggPrompt;

    // 先检查空输入框和重复输入
    for (element of inputBoxes) {
        const value = element.value;
        if (value == undefined || value == "") {
            return;
        }
        if (inputs.includes(value)) {
            playErrorAnimation(element);
            element.value = "";
            return;
        }
        else {
            inputs.push(value);
        }
    }
    for (element of inputBoxes) {
        const value = element.value;
        if (easterEggPrompt && easterEggPrompt[value]) {
            tryAddEasterEggDescription(value, easterEggPrompt[value]);
            result = false;
            element.value = "";
        }
        else if (correctPrompt && !correctPrompt.includes(value)) {
            playErrorAnimation(element);
            result = false;
            element.value = "";
        }
    }
    return result;
}

function setupMultipleInputs(event, color) {
    color = color ? color : getColor(event, DATA_TYPES.Event);
    const inputBoxes = document.getElementById('multiple-inputs').getElementsByClassName('input-box');
    const goButton = document.getElementById('go-2');

    for (element of inputBoxes) {
        element.style.borderColor = color;
    }
    setTextAndBorderColor(goButton, color);
    setImageColor(document.querySelector("#go-img-2"), color, 'arrow-white.png', 'arrow-purple.png', 'arrow-red.png');

    goButton.onclick = () => {
        if (getMultipleInputsUseResult(event, inputBoxes)) {
            startEvent(event.nextEvent);
        }
    }
}

function setupInOutArea(event, eventId, color) {
    popAllChildElement(lootContainer);
    const eventType = getEventType(event);
    if (eventType == EVENT_TYPES.MultiInput) {
        document.getElementById('multiple-inputs').style.display = 'initial';
        setupMultipleInputs(event, color);
    }
    else if (eventType == EVENT_TYPES.End) {
        document.getElementById('end-link').style.display = 'initial';
    }
    else if (eventType == EVENT_TYPES.Output || branch.m) {
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

    modal.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            RAISA.style.display = "none";
        }
    }
}

/*
    ===== 计算器相关 =====
*/

function setCalculaterVisibility( visibility ) {
    document.querySelector('.calculater-container').style.display = visibility ? "flex" : "none";
    document.querySelector('.calculater').style.display = visibility ? "initial" : "none";
}

function calculate() {
    var calcRes = parseInt(cal1.value) + parseInt(cal2.value);
    if (!isNaN(calcRes)) {
        const regExp = /J$/;
        if (regExp.test(cal1.value) || regExp.test(cal2.value)){
            calcRes += 'J';
        }
        document.getElementById("input-box").value = calcRes;
    }
}

function deployCalculater() {
    var calc = document.querySelector(".calculater");
    calc.onclick = () => {
        console.log(document.querySelector('.calculater-container').style.display);
        document.querySelector('.calculater-container').style.display = (document.querySelector('.calculater-container').style.display == "flex" ? "none" : "flex");
        // const classList = document.querySelector(".calculater-container").classList;
        // classList.contains("display") ? classList.remove("display") : classList.add("display");
    };
    cal1.onkeyup = calculate;
    cal2.onkeyup = calculate;
}

function goNODREAM() {
    var style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule('* {border-radius: 0 !important;border-color: white !important;color: white !important;}', 0);

    style.sheet.insertRule('.img-container{display: none !important;}', 0);
    style.sheet.insertRule('.text-container{width:80% !important;height:80% !important;}', 0);
    style.sheet.insertRule('.card-image{display: none !important;}', 0);
    style.sheet.insertRule('.card-title{display: flex !important;}', 0);

    style.sheet.insertRule('.card-description-img{display: none !important;}', 0);
    style.sheet.insertRule('.divider{display: none !important;}', 0);
    style.sheet.insertRule('.card-description-text{height: 100% !important;}', 0);

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
    const inputBox = document.getElementById("input-box");
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

function prepareFadeIn(element) {
    element.classList.remove('fade-in');
    element.style.opacity = 0;
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

function typingAnimation(element, text, speed, callback) {
    // console.log(123);
    element.innerText = "\n";
    let i = 0;
    let timer = setInterval(() => {
        if (i < text.length) {
            if(text.charAt(i) != ' ')
                element.innerText += text.charAt(i);
            else
                element.innerText += ' ';
            i++;
        }
        else {
            clearInterval(timer);
            callback();
        }
    }, speed);
    
}