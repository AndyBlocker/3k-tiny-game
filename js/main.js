const DEV = true;

/* 
    ===== TUNABLES =====
*/
const SAFE_COLOR = "#8FBC8B";
const EUCLID_COLOR = "#F0E68C";
const KETER_COLOR = "#CD5C5C";
const CLINICAL_COLOR = "#BBBBBB";
const DEFAULT_CLINICAL_VAGUE_DESC = "该异常的性质不明。";
const DEFAULT_CONTINUE_TEXT = "前往下一事件";

/* 
    ===== VARIABLES =====
*/

const cardContainer = document.querySelector('.card-container');
const lootContainer = document.getElementById('loots');

const maxCardsToShow = 4;

let currentEventId = "434";
let currentStartIndex = 0;
let deck = ['1', '2', '3'];
let branch = {
  j: false, // J线完成情况
  d: false, // 梦线完成情况
  l: false, // 爱线完成情况
  m: false  // 钱线完成情况
};

/* 
    ===== BOOT CHECK =====
*/

if (typeof (allCards) === undefined) {
  window.alert('card import failed!');
}
if (typeof (allEvents) === undefined) {
  window.alert('event import failed!');
}

/* 
    ===== DECK INITIALIZATION =====
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

function getCardDescription(id) {
  const card = allCards[id];
  if (card == undefined || card.description == undefined) {
    return "未找到卡牌信息！ID：" + id;
  }

  if (branch.j && branch.l) {
    return card.descriptionNoJL || DEFAULT_CLINICAL_VAGUE_DESC;
  }
  else if (branch.j && card.descriptionNoJ != undefined) {
    return card.descriptionNoJ;
  }
  else if (branch.l && card.descriptionNoL != undefined) {
    return card.descriptionNoL;
  }
  else {
    return card.description;
  }
}

function previewCard(id) {
  const desc = getCardDescription(id);
  if (desc) {
    window.alert(desc);
  }
  else {
    window.alert(id + ' has been clicked!');
  }
}

function addCardToContainer(cardId, options) {
  const cardDiv = document.createElement('div');
  cardDiv.id = cardId;
  cardDiv.classList.add('card');

  const cardTitle = document.createElement('div');
  cardTitle.innerText = cardId;
  cardTitle.classList.add('card-title');
  cardDiv.appendChild(cardTitle);

  const cardImage = document.createElement('img');
  cardImage.src = options && options.imageUrl ? options.imageUrl : './img/585.png';
  cardImage.classList.add('card-image');
  cardDiv.appendChild(cardImage);

  cardDiv.addEventListener('click', () => { previewCard(cardId); });
  // cardDiv.style.backgroundColor = (options && options.color) || '#222222';
  cardDiv.style.backgroundColor = '#222222';
  cardContainer.appendChild(cardDiv);
}


function popCardFromContainer(container, cardId) {
  let childs = container.childNodes;
  for (var i = 0; i < childs.length; i++) {
    if (childs[i].id == cardId) {
      container.removeChild(childs[i]);
      return;
    }
  }
}

function popAllChildElement(parent) {
  let childs = parent.childNodes;
  for (var i = childs.length - 1; i >= 0; i--) {
    parent.removeChild(childs[i]);
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

function addCardToDeck(cardId, options) {
  deck.push(cardId);
  addCardToContainer(cardId, options);
  currentStartIndex = Math.max(0, deck.length - maxCardsToShow);
  updateCardVisibility();
}

function refreshCardContainer() {
  popAllChildElement(cardContainer);
  deck.forEach(addCardToContainer);
  updateCardVisibility();
}

document.querySelector('.prev-card').addEventListener('click', () => {
  currentStartIndex = Math.max(currentStartIndex - 1, 0);
  updateCardVisibility();
});

document.querySelector('.next-card').addEventListener('click', () => {
  currentStartIndex = Math.min(currentStartIndex + 1, Math.max(0, deck.length - maxCardsToShow));
  updateCardVisibility();
});

/* 
    ===== EVENT INITIALIZATION =====
*/

function getEventDescription(event) {
  if (event == undefined || event.description == undefined) {
    return "test in white";
  }
  // TODO: 支持不同线描述
  return event.description;
}

document.querySelector('.hintPrompt').addEventListener('click', () => {
  document.querySelector('.hintText').style.display = 'initial';
})

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

let _lootToPick = 0;

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

function checkDeck(cardList) {
  let newCards = [];
  for (var i = 0; i < cardList.length; i++) {
    if (!deck.includes(cardList[i])) {
      newCards.push(cardList[i]);
    }
  }
  return newCards;
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

function setupOutputArea(event) {
  if (event == undefined) {
    return;
  }
  popAllChildElement(document.getElementById('outputs'));
  let choices = [];
  if (event.choices != undefined) {
    choices = event.choices;
  }
  else {
    choices.push(event);
  }
  for (var i = 0; i < choices.length; i++) {
    let choice = choices[i];
    addOutputButton(choice.nextEvent, choice.buttonPrompt);
  }
}

function playErrorAnimation() {
  window.alert('Wrong input!');
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
  if (event.correctPrompt == undefined || event.correctPrompt.includes(input)) {
    startEvent(event.nextEvent);
  }
  else if (event.easterEggPrompt[input] != undefined) {
    tryAddEasterEggDescription(input, event.easterEggPrompt[input]);
  }
  else {
    playErrorAnimation();
  }
}

function setupInputArea(event) {
  document.getElementById('go').onclick = () => {
    const inputBox = document.querySelector('.input-box');
    const input = inputBox.value;
    inputBox.value = "";
    getUseResult(input, event);
  }
}

function setupInOutArea(event) {
  popAllChildElement(lootContainer);
  const isOutput = event == undefined || event.type != "input";
  if (isOutput) {
    document.getElementById('outputs').style.display = 'initial';
    setupOutputArea(event);
  }
  else {
    document.getElementById('inputs').style.display = 'initial';
    setupInputArea(event);
  }
}


function startEvent(eventId) {
  currentEventId = eventId;

  const event = allEvents[eventId];
  document.querySelector('.topic').innerText = eventId;
  document.getElementById('event-description').innerText = getEventDescription(event);
  document.getElementById('inputs').style.display = 'none';
  document.getElementById('outputs').style.display = 'none';

  setupHint(event);
  if (!setupLootArea(event)) {
    setupInOutArea(event);
  }
}

startEvent(currentEventId);
deck.forEach(addCardToContainer);


/* 
    ===== DEV AREA =====
*/

const globalEval = eval; // A reference to eval() in topmost level so that it can modify global variables
if (DEV) {
  document.querySelector('.add-card').addEventListener('click', () => {
    const inputBox = document.getElementById('dev-add-card-box');
    const id = inputBox.value;
    if (id != undefined && id != "" && !deck.includes(id)) {
      inputBox.value = "";
      addCardToDeck(id);
    }
    else {
      addCardToDeck(deck.length + 1);
    }
  });

  document.getElementById('dev-toggle-branch').addEventListener('click', () => {
    let checkboxes = document.getElementsByName("dev-choose-branch");
    branch.j = checkboxes[0].checked;
    branch.d = checkboxes[1].checked;
    branch.l = checkboxes[2].checked;
    branch.m = checkboxes[3].checked;
    refreshCardContainer();
  });

  /* 
    ===== Hot Load New Data =====
  */
  const dataTypeDesc = {
    "card": {
      varName: 'allCards',
      filepath: 'cards.js',
      defaultText: '"type": "SCP",\n"objClass": "Safe",\n"description": "Card 1. Object Class: Safe",\n ......',
    },
    "event": {
      varName: 'allEvents',
      filepath: 'events.js',
      defaultText: '"type": "input",\n"description": "This is a description of event 434."\n"hintText": "This is the hint"\n"getCards": ["testCard", "100"],\n ......',

    }
  };
  let dirtyMarker = {
    "card": {
      single: [],
      all: false
    },
    "event": {
      single: [],
      all: false
    }
  };

  let _dataType, _replaceAll;
  function dev_toggleEvalInput(dataType, replaceAll) {
    _dataType = dataType;
    _replaceAll = replaceAll;
    const fileHeader = document.getElementById('dev-eval-file');
    const keyHeader = document.getElementById('dev-eval-key');
    const inputArea = document.getElementById('dev-eval-content');
    if (_replaceAll) {
      fileHeader.style.display = 'initial';
      keyHeader.style.display = 'none';
      inputArea.setAttribute("placeholder", '');
    }
    else {
      fileHeader.style.display = 'none';
      keyHeader.style.display = 'initial';
      inputArea.setAttribute("placeholder", dataTypeDesc[_dataType].defaultText);
    }
    document.getElementById('dev-eval-path').innerText = dataTypeDesc[_dataType].filepath;
  }
  dev_toggleEvalInput('event', false);

  document.getElementById('dev-clear-input').addEventListener('click', () => {
    document.getElementById('dev-eval-title').setAttribute("placeholder", '');
    document.getElementById('dev-eval-content').setAttribute("placeholder", '');
  });

  function tryExecute(text, callback) {
    try {
      globalEval(text);
      callback();
    } catch (e) {
      if (e instanceof SyntaxError) {
        window.alert("输入存在语法错误！");
      }
    }
  }

  function changeSingle(key, text) {
    if (key == undefined || key == '') {
      window.alert("ID不能为空！");
      return;
    }
    let fullText = dataTypeDesc[_dataType].varName + '["' + key + '"] = {' + text + '}';
    tryExecute(fullText, () => {
      let dirtyList = dirtyMarker[_dataType].single;
      if (!dirtyList.includes(key)) {
        dirtyList.push(key);
      }
    });
  }

  document.getElementById('dev-load-data').addEventListener('click', () => {
    const key = document.getElementById('dev-eval-title').value;
    const text = document.getElementById('dev-eval-content').value;
    if (_replaceAll) {
      tryExecute(text.slice(3), //Remove the var identifier
        () => { dirtyMarker[_dataType].all = true; })
    }
    else {
      changeSingle(key, text);
    }
    startEvent(currentEventId);
    refreshCardContainer();
  });

}
else {
  document.querySelector('.dev-area').style.display = 'none';
}

updateCardVisibility();
