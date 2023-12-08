/* 
    ===== DECK INITIALIZATION =====
*/

var allCards;
// TODO: 上传到wikidot之后要改链接？github有点慢并且有可能被墙
fetch(JSON_PATH + 'cards.json').then(response => {
  if (!response.ok) {
    throw new Error("HTTP error " + response.status);
  }
  return response.json();
}).then(json => {
  allCards = json;
  deck.forEach(addCardToContainer);
  updateCardVisibility();
}).catch(function () {
  this.dataError = true;
  console.log("ERROR: cards.json not found!");
  window.alert("未能读取cards.json！如果你看到这个弹窗，请告知");
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
fetch(JSON_PATH + 'events.json').then(response => {
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
  window.alert("未能读取events.json！如果你看到这个弹窗，请告知");
});


document.querySelector('.hintPrompt').addEventListener('click', () => {
  document.querySelector('.hintText').style.display = 'initial';
})