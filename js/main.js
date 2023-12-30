/* 
    ===== DECK INITIALIZATION =====
*/

var allCards;
loadDataAndBoot(DATA_TYPES.Card, 'cards.json', attributesCard, (populatedData) => {
  allCards = populatedData;
  for (const v of deck) {addCardToContainer(v);}
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

// 默认隐藏
document.querySelector('.prev-card').style.display = 'none';
document.querySelector('.next-card').style.display = 'none';
/* 
    ===== EVENT INITIALIZATION =====
*/

var allEvents;
loadDataAndBoot(DATA_TYPES.Event, 'events.json', attributesEvent, (populatedData) => {
  allEvents = populatedData;
  startEvent(currentEventId);
});


document.getElementById('hintPrompt1').addEventListener('click', () => {
  if (hintText1.style.display == 'initial') {
    hintText1.style.display = 'none';
    document.getElementById('hintPrompt2').style.display = 'none';
    hintText2.style.display = 'none';
    document.querySelector('.main-container').style.maxHeight = 'calc(80% - 3.5em)';
  }
  else {
    hintText1.style.display = 'initial';
    if (hintText2.innerHTML != '') {
      document.getElementById('hintPrompt2').style.display = 'initial';
    }
    document.querySelector('.main-container').style.maxHeight = 'calc(80% - 5em)';
  }
})
document.getElementById('hintPrompt2').addEventListener('click', () => {
  hintText2.style.display = hintText2.style.display == 'initial' ? 'none' : 'initial';
  if(hintText2.style.display == 'initial'){
    document.querySelector('.main-container').style.maxHeight = 'calc(80% - 6.5em)';
  }
  else{
    document.querySelector('.main-container').style.maxHeight = 'calc(80% - 5em)';
  }
})

window.addEventListener('resize', calcNumberOfCardToShow);
calcNumberOfCardToShow();
deployCalculater();

window.addEventListener('resize', updateCalcWidth);
updateCalcWidth();

initCardDrag();