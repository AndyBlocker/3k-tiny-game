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

// TODO: 上传到wikidot之后要改链接？github有点慢并且有可能被墙
fetch('https://raw.githubusercontent.com/AndyBlocker/3k-tiny-game/main/json/cards.json').then(response => {
  if (!response.ok) {
    throw new Error("HTTP error " + response.status);
  }
  return response.json();
}).then(json => {
  allCards = json;
}).catch(function () {
  this.dataError = true;
  console.log("ERROR: cards.json not found!");
});

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

fetch('https://raw.githubusercontent.com/AndyBlocker/3k-tiny-game/main/json/events.json').then(response => {
  if (!response.ok) {
    throw new Error("HTTP error " + response.status);
  }
  return response.json();
}).then(json => {
  allEvents = json;
  startEvent(currentEventId);
}).catch(function () {
  this.dataError = true;
  console.log("ERROR: events.json not found!");
});


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

// startEvent(currentEventId);
deck.forEach(addCardToContainer);
updateCardVisibility();