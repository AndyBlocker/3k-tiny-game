const DEV = true;

/* 
    ===== TUNABLES =====
*/
const SAFE_COLOR = "#8FBC8B";
const EUCLID_COLOR = "#F0E68C";
const KETER_COLOR = "#CD5C5C";
const CLINICAL_COLOR = "#BBBBBB";
const IMAGE_PATH = "./img/";
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
let deck = ['1', '2', '3', '585'];
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

// 上传到wiki之后改成fetch
// fetch('./json/events.json').then(response => {
//   if (!response.ok) {
//     throw new Error("HTTP error " + response.status);
//   }
//   return response.json();
// }).then(json => {
//   allEvents = json;
// }).catch(function () {
//   this.dataError = true;
//   console.log("ERROR: events.json not found!");
// });


document.querySelector('.hintPrompt').addEventListener('click', () => {
  document.querySelector('.hintText').style.display = 'initial';
})

let _lootToPick = 0;





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
  const isOutputType = event == undefined || event.type != "input";
  if (isOutputType || branch.m) {
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
  document.getElementById('event-description').innerText = getEventDescription(eventId);
  document.getElementById('inputs').style.display = 'none';
  document.getElementById('outputs').style.display = 'none';

  setupHint(event);
  if (!setupLootArea(event)) {
    setupInOutArea(event);
  }
}

startEvent(currentEventId);
deck.forEach(addCardToContainer);
updateCardVisibility();
print(123);