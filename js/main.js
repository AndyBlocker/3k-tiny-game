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


document.querySelector('.hintPrompt').addEventListener('click', () => {
  document.querySelector('.hintText').style.display = 'initial';
})