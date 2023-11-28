const DEV = true;

/* 
    ===== TUNABLES =====
*/
const SAFE_COLOR = "#8FBC8B";
const EUCLID_COLOR = "#F0E68C";
const KETER_COLOR = "#CD5C5C";
const CLINICAL_COLOR = "#BBBBBB";
const DEFAULT_CLINICAL_VAGUE_DESC = "该异常的性质不明。";
const DEFAULT_CONTINUE_TEXT = "继续";

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

if (typeof(allCards) === undefined) {
  window.alert('card import failed!');
}
if (typeof(allEvents) === undefined) {
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

function getColor( cardId ) {
  if (branch.j){
    return CLINICAL_COLOR;
  }

  if (!cardId || !allCards[cardId] || !allCards[cardId].objClass ){
    return getRandomColor();
  }

  let objClass = allCards[cardId].objClass;
  switch ( objClass.toLowerCase() ){
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
  if (card==undefined || card.description==undefined){
    return "未找到卡牌信息！ID：" + id;
  }

  if (branch.j && branch.l){
    return card.descriptionNoJL || DEFAULT_CLINICAL_VAGUE_DESC;
  }
  else if (branch.j && card.descriptionNoJ != undefined){
    return card.descriptionNoJ;
  }
  else if (branch.l && card.descriptionNoL != undefined){
    return card.descriptionNoL;
  }
  else{
    return card.description;
  }
}

function previewCard(id) {
  const desc = getCardDescription(id);
  if ( desc ){
    window.alert(desc);
  }
  else{
    window.alert(id + ' has been clicked!');
  }
}

function addCardToContainer(cardId, options) {
    const cardDiv = document.createElement('div');
    cardDiv.innerText = cardId;
    cardDiv.id = cardId;
    cardDiv.classList.add('card');
    cardDiv.addEventListener('click', () => { previewCard(cardId); });

    cardDiv.style.backgroundColor = options.color || getColor( cardId );
  
    cardContainer.appendChild(cardDiv);
}

function popCardFromContainer(container, cardId) {
  let childs = container.childNodes;
  for(var i=0;i<childs.length;i++){
    if(childs[i].id==cardId){
      container.removeChild(childs[i]);
      return;
    }
  }
}

function popAllChildElement( parent ) {
  let childs = parent.childNodes;
  for(var i=childs.length-1;i>=0;i--){
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
  currentStartIndex = Math.max(0,deck.length - maxCardsToShow);
  updateCardVisibility();
}

document.querySelector('.prev-card').addEventListener('click', () => {
  currentStartIndex = Math.max(currentStartIndex - 1, 0);
  updateCardVisibility();
});

document.querySelector('.next-card').addEventListener('click', () => {
  currentStartIndex = Math.min(currentStartIndex + 1, Math.max(0,deck.length - maxCardsToShow));
  updateCardVisibility();
});

/* 
    ===== EVENT INITIALIZATION =====
*/

function getEventDescription(event) {
  if (event==undefined || event.description==undefined) {
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
  if (event==undefined || event.hintText==undefined) {
    hintPrompt.style.display = 'none';
    return;
  }
  
  const hintText = document.querySelector('.hintText');
  hintPrompt.style.display = 'initial';
  hintText.style.display = 'none';
  hintText.innerText = event.hintText;
}

function addCardToLootContainer(cardId, divClass) {
  const cardDiv = document.createElement('button');
  cardDiv.innerText = "获得" + cardId;
  cardDiv.id = cardId;
  cardDiv.classList.add(divClass);

  let options = { "color": getColor( cardId ) };
  cardDiv.style.backgroundColor = options.color;
  setTimeout( () => {cardDiv.onclick = () => { 
    addCardToDeck(cardId, options);
    cardDiv.classList.add('hidden-element');
    cardDiv.onclick = () => {};
  }} , 100);
  lootContainer.appendChild(cardDiv);
}

function setupLootArea_internal(cardList) {
  if (cardList.length >= 2) {
    addCardToLootContainer( cardList[0], 'medium-button' );
    addCardToLootContainer( cardList[1], 'medium-button' );
    setupLootArea_internal(cardList.slice(2));
  }
  else if (cardList.length == 1) {
    addCardToLootContainer( cardList[0], 'large-button' );
  }
  else {
    return;
  }
}

function checkDeck(cardList){
  let newCards = [];
  for (var i=0;i<cardList.length;i++) {
    if (!deck.includes(cardList[i])){
      newCards.push(cardList[i]);
    }
  }
  return newCards;
}

function setupLootArea(event) {
  if (event==undefined || event.getCards==undefined) {
    return;
  }
  const newCards = checkDeck(event.getCards);
  setupLootArea_internal(newCards);
}

function setupOutputArea(event) {
  if (event==undefined || event.nextEvent==undefined) {
    return;
  }

  const continueButton = document.querySelector('.continue');
  continueButton.innerText = event.buttonPrompt || DEFAULT_CONTINUE_TEXT;
  setTimeout(() => continueButton.onclick = () => { 
    startEvent(event.nextEvent);
  }, 100);
}

function playErrorAnimation(){
  window.alert('Wrong input!');
}

function tryAddEasterEggDescription( easterEggID, text ) {
  const descriptionArea = document.getElementById('event-description');
  let childs = descriptionArea.childNodes;
  for(var i=0;i<childs.length;i++){
    if (childs[i].name == easterEggID){
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

function startEvent(eventId) {
  currentEventId = eventId;
  popAllChildElement(lootContainer);

  const event = allEvents[eventId];
  document.querySelector('.topic').innerText = eventId;
  document.getElementById('event-description').innerText = getEventDescription(event);

  setupHint(event);
  setupLootArea(event);

  const isOutput = event == undefined || event.type != "input";
  if (isOutput) {
    document.getElementById('outputs').style.display = 'initial';
    document.getElementById('inputs').style.display = 'none';
    setupOutputArea(event);
  }
  else {
    document.getElementById('inputs').style.display = 'initial';
    document.getElementById('outputs').style.display = 'none';
    setupInputArea(event);
  }
}

startEvent(currentEventId);
deck.forEach(addCardToContainer);


/* 
    ===== DEV AREA =====
*/


if (DEV){
  document.querySelector('.add-card').addEventListener('click', () => { 
    addCardToDeck(deck.length + 1);
  });

  document.getElementById( 'dev-toggle-branch' ).addEventListener('click', () => {
    let checkboxes = document.getElementsByName("dev-toogle-branch");
    branch.j = checkboxes[0].checked;
    branch.d = checkboxes[1].checked;
    branch.l = checkboxes[2].checked;
    branch.m = checkboxes[3].checked;

    popAllChildElement(cardContainer);
    deck.forEach(addCardToContainer);
    updateCardVisibility();
  });
}

updateCardVisibility();
