/* 
    ===== DECK INITIALIZATION =====
*/

var allCards;
loadDataAndBoot(DATA_TYPES.Card, 'cards.json', attributesCard, (populatedData) => {
  allCards = populatedData;
  deck.forEach(addCardToContainer);
  updateCardVisibility();
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

var allEvents;
loadDataAndBoot(DATA_TYPES.Event, 'events.json', attributesEvent, (populatedData) => {
  allEvents = populatedData;
  startEvent(currentEventId);
});


document.getElementById('hintPrompt1').addEventListener('click', () => {
  hintText1.style.display = 'initial';
  if (hintText2.innerHTML) {
    document.getElementById('hintPrompt2').style.display = 'initial';
  }
})
document.getElementById('hintPrompt2').addEventListener('click', () => {
  hintText2.style.display = 'initial';
})