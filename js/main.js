const DEV = true;

/* 
    ===== TUNABLES =====
*/
const SAFE_COLOR = "#8FBC8B";
const EUCLID_COLOR = "#F0E68C";
const KETER_COLOR = "#CD5C5C";
const CLINICAL_COLOR = "#BBBBBB";
const DEFAULT_CLINICAL_VAGUE_DESC = "该异常的性质不明。";

/* 
    ===== VARIABLES =====
*/

const cardContainer = document.querySelector('.card-container');

const maxCardsToShow = 4;

let currentStartIndex = 0;
let deck = ['1', '2', '3'];
let branch = {j: false, d: false, l: false, m: false};

deck.forEach(addCardToContainer);

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

function getDescription(id) {
  let card = allCards[id];
  if (!card || !card.description){
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
  let desc = getDescription(id);
  if ( desc ){
    window.alert(desc);
  }
  else{
    window.alert(id + ' has been clicked!');
  }
}

function addCardToContainer(cardId) {
    const cardDiv = document.createElement('div');
    cardDiv.innerText = cardId;
    cardDiv.id = cardId;
    cardDiv.classList.add('card');
    cardDiv.addEventListener('click', () => { previewCard(cardId); });

    cardDiv.style.backgroundColor = getColor( cardId );
  
    cardContainer.appendChild(cardDiv);
    
}

function popCardFromContainer(cardId) {
  let childs = cardContainer.childNodes;
  for(var i=0;i<childs.length-1;i++){
    if(childs[i].id==cardId){
      cardContainer.removeChild(childs[i]);
      return;
    }
  }
}

function popAllCardsFromContainer() {
  let childs = cardContainer.childNodes;
  for(var i=childs.length-1;i>=0;i--){
    cardContainer.removeChild(childs[i]);
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

document.querySelector('.continue').addEventListener('click', () => { 
  window.alert('button has been clicked!'); 
});

document.querySelector('.prev-card').addEventListener('click', () => {
  currentStartIndex = Math.max(currentStartIndex - 1, 0);
  updateCardVisibility();
});

document.querySelector('.next-card').addEventListener('click', () => {
  currentStartIndex = Math.min(currentStartIndex + 1, Math.max(0,deck.length - maxCardsToShow));
  updateCardVisibility();
});

if (DEV){
  document.querySelector('.add-card').addEventListener('click', () => { 
    deck.push((deck.length + 1).toString());
    addCardToContainer(deck[deck.length - 1]);
    updateCardVisibility();
  });

  document.getElementById( 'dev-toggle-branch' ).addEventListener('click', () => {
    let checkboxes = document.getElementsByName("dev-toogle-branch");
    branch.j = checkboxes[0].checked;
    branch.d = checkboxes[1].checked;
    branch.l = checkboxes[2].checked;
    branch.m = checkboxes[3].checked;

    popAllCardsFromContainer();
    deck.forEach(addCardToContainer);
  });
}

updateCardVisibility();
