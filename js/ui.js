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
    titleDiv.textContent = cardId;
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
        nameDiv.textContent = cardData.name;
        nameDiv.className = 'card-description-name';
        modalContent.appendChild(nameDiv);
    }

    var descriptionDiv = document.createElement('div');
    descriptionDiv.textContent = getDescription(cardId, DATA_TYPES.Card);
    descriptionDiv.className = 'card-description-text';
    modalContent.appendChild(descriptionDiv);

    modal.style.display = "flex";

    var span = document.getElementsByClassName('close')[0];

    span.onclick = function () {
        modal.style.display = "none";
        modalContent.innerHTML = '';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            modalContent.innerHTML = '';
        }
    }
}

// 将card绘制到container中
function addCardToContainer(cardId, options) {
    const cardDiv = document.createElement('div');
    cardDiv.id = cardId;
    cardDiv.classList.add('card');

    options = options ? options : {};
    options.color = options.color ? options.color : getColor(allCards[cardId]);
    cardDiv.style.borderColor = options.color;

    const cardTitle = document.createElement('div');
    cardTitle.innerText = cardId;
    cardTitle.classList.add('card-title');
    cardDiv.appendChild(cardTitle);
    cardTitle.style.color = options.color;

    const cardImage = document.createElement('img');
    cardImage.src = options && options.imageUrl ? options.imageUrl : './img/cards/585.png';
    cardImage.classList.add('card-image');
    cardDiv.appendChild(cardImage);

    cardDiv.addEventListener('click', () => { previewCard(cardId, options); });
    cardDiv.style.backgroundColor = '#222222';
    cardContainer.appendChild(cardDiv);
}

// 从container中删除card
function popCardFromContainer(container, cardId) {
    let childs = container.childNodes;
    for (var i = 0; i < childs.length; i++) {
        if (childs[i].id == cardId) {
            container.removeChild(childs[i]);
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

function addCardToLootContainer(event, cardId, divClass) {
    const cardDiv = document.createElement('button');
    cardDiv.innerText = "获得" + cardId;
    cardDiv.id = cardId;
    cardDiv.classList.add(divClass);

    let options = { "color": getColor(allCards[cardId]) };
    cardDiv.style.borderColor = options.color;
    setTimeout(() => {
        cardDiv.onclick = () => {
            addCardToDeck(cardId, options);
            cardDiv.classList.add('hidden-element');
            cardDiv.onclick = () => { };

            _lootToPick--;
            if (_lootToPick == 0) {
                setupInOutArea(event);
            }
        }
    }, 100);
    lootContainer.appendChild(cardDiv);
}

function setupLootArea_internal(event, cardList) {
    if (cardList.length >= 2) {
        addCardToLootContainer(event, cardList[0], 'medium-button');
        addCardToLootContainer(event, cardList[1], 'medium-button');
        setupLootArea_internal(event, cardList.slice(2));
    }
    else if (cardList.length == 1) {
        addCardToLootContainer(event, cardList[0], 'large-button');
    }
    else {
        return;
    }
}

function setupLootArea(event) {
    popAllChildElement(lootContainer);
    if (event == undefined || event.getCards == undefined) {
        return false;
    }
    const newCards = checkDeck(event.getCards);
    _lootToPick = newCards.length;
    if (_lootToPick == 0) {
        return false;
    }

    setupLootArea_internal(event, newCards);
    return true;
}

function setupOutputArea(event, eventId) {
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
    for (var i = 0; i < choices.length; i++) {
        let choice = choices[i];
        addOutputButton(choice.nextEvent, choice.buttonPrompt);
    }
}

function setupInputArea(event, eventId) {
    document.getElementById('go').onclick = () => {
        const inputBox = document.querySelector('.input-box');
        const input = inputBox.value;
        inputBox.value = "";
        getUseResult(input, event, eventId);
    }
}

function playErrorAnimation() {
    triggerErrorAnimation(document.querySelector('.input-box'));
}

function addOutputButton(nextEventId, buttonPrompt) {
    if (nextEventId == undefined) {
        return;
    }

    const continueButton = document.createElement('button');
    continueButton.name = nextEventId;
    continueButton.classList.add('continue');
    continueButton.classList.add('large-button');
    document.getElementById('outputs').appendChild(continueButton);

    continueButton.innerText = buttonPrompt ? buttonPrompt : DEFAULT_CONTINUE_TEXT;
    setTimeout(() => continueButton.onclick = () => {
        startEvent(nextEventId);
    }, 100);
}

function setupInOutArea(event, eventId) {
    popAllChildElement(lootContainer);
    const isOutputType = event == undefined || (event.type != "input" && event.type != "Input");
    if (isOutputType || branch.m) {
        document.getElementById('outputs').style.display = 'initial';
        setupOutputArea(event, eventId);
    }
    else {
        document.getElementById('inputs').style.display = 'initial';
        setupInputArea(event, eventId);
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
    let cardSize = 10 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    maxCardsToShow = Math.min(Math.floor(screenWidth / cardSize), 8);
    updateCardVisibility();
    console.log("maxCardsToShow: " + maxCardsToShow);
}