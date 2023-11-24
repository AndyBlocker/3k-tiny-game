/* 
    ===== TUNABLES =====
*/
const SAFE_COLOR = "#8FBC8B";
const EUCLID_COLOR = "#F0E68C";
const KETER_COLOR = "#CD5C5C";

/* 
    ===== VARIABLES =====
*/

const cardContainer = document.querySelector('.card-container');

const maxCardsToShow = 4;

let currentStartIndex = 0;
let deck = ['1', '2', '3'];
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

function previewCard(id) {
  let card = allCards[id];
  if ( card && card.description ){
    window.alert(card.description);
  }
  else{
    window.alert(id + ' has been clicked!');
  }
}

function addCardToContainer(cardId) {
    const cardDiv = document.createElement('div');
    cardDiv.innerText = cardId;
    cardDiv.classList.add('card');
    cardDiv.addEventListener('click', () => { previewCard(cardId); });

    cardDiv.style.backgroundColor = getColor( cardId );
  
    cardContainer.appendChild(cardDiv);
    
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

document.querySelector('.add-card').addEventListener('click', () => { 
    deck.push((deck.length + 1).toString());
    addCardToContainer(deck[deck.length - 1]);
    updateCardVisibility();
});

document.querySelector('.prev-card').addEventListener('click', () => {
  currentStartIndex = Math.max(currentStartIndex - 1, 0);
  updateCardVisibility();
});

document.querySelector('.next-card').addEventListener('click', () => {
  currentStartIndex = Math.min(currentStartIndex + 1, Math.max(0,deck.length - maxCardsToShow));
  updateCardVisibility();
});


updateCardVisibility();
