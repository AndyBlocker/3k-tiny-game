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

function getColor(cardId) {
    if (branch.j) {
        return CLINICAL_COLOR;
    }

    if (!cardId || !allCards[cardId] || !allCards[cardId].objClass) {
        return getRandomColor();
    }

    let objClass = allCards[cardId].objClass;
    switch (objClass.toLowerCase()) {
        case "safe":
            return SAFE_COLOR;
        case "euclid":
            return EUCLID_COLOR;
        case "keter":
            return KETER_COLOR;
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
function previewCard(cardId) {
    var cardData = allCards[cardId];
    var modal = document.getElementById('modal');
    var modalContent = modal.querySelector('.modal-content');

    modalContent.innerHTML = '<span class="close">&times;</span>';

    var titleDiv = document.createElement('div');
    titleDiv.textContent = cardId;
    titleDiv.className = 'card-description-id';
    modalContent.appendChild(titleDiv);

    if (cardData && cardData.img) {
        var img = document.createElement('img');
        img.src = IMAGE_PATH + cardData.img;
        img.className = 'card-description-img';
        modalContent.appendChild(img);
    }

    var divider = document.createElement('div');
    divider.className = 'divider';
    modalContent.appendChild(divider);

    if (cardData && cardData.name) {
        var nameDiv = document.createElement('div');
        nameDiv.textContent = cardData.name;
        nameDiv.className = 'card-description-name';
        modalContent.appendChild(nameDiv);
    }

    var descriptionDiv = document.createElement('div');
    descriptionDiv.textContent = getCardDescription(cardId);
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

    const cardTitle = document.createElement('div');
    cardTitle.innerText = cardId;
    cardTitle.classList.add('card-title');
    cardDiv.appendChild(cardTitle);

    const cardImage = document.createElement('img');
    cardImage.src = options && options.imageUrl ? options.imageUrl : './img/cards/585.png';
    cardImage.classList.add('card-image');
    cardDiv.appendChild(cardImage);

    cardDiv.addEventListener('click', () => { previewCard(cardId); });
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

    let options = { "color": getColor(cardId) };
    cardDiv.style.backgroundColor = options.color;
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

function playErrorAnimation() {
    window.alert('Wrong input!');
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

    continueButton.innerText = buttonPrompt || DEFAULT_CONTINUE_TEXT;
    setTimeout(() => continueButton.onclick = () => {
        startEvent(nextEventId);
    }, 100);
}