const cardContainer = document.querySelector('.card-container');

const maxCardsToShow = 4;

let currentStartIndex = 0;
let cards = ['1', '2', '3'];
cards.forEach(addCardToContainer);





function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function addCardToContainer(card) {
    const cardDiv = document.createElement('div');
    cardDiv.innerText = card;
    cardDiv.classList.add('card');
    cardDiv.addEventListener('click', () => { window.alert(card + ' has been clicked!'); });

    cardDiv.style.backgroundColor = getRandomColor();
  
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
    cards.push((cards.length + 1).toString());
    addCardToContainer(cards[cards.length - 1]);
    updateCardVisibility();
});

document.querySelector('.prev-card').addEventListener('click', () => {
  currentStartIndex = Math.max(currentStartIndex - 1, 0);
  updateCardVisibility();
});

document.querySelector('.next-card').addEventListener('click', () => {
  currentStartIndex = Math.min(currentStartIndex + 1, Math.max(0,cards.length - maxCardsToShow));
  updateCardVisibility();
});



updateCardVisibility();
