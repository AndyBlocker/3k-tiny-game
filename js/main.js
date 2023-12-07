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
// fetch('https://raw.githubusercontent.com/AndyBlocker/3k-tiny-game/main/json/cards.json').then(response => {
//   if (!response.ok) {
//     throw new Error("HTTP error " + response.status);
//   }
//   return response.json();
// }).then(json => {
//   allCards = json;
// }).catch(function () {
//   this.dataError = true;
//   console.log("ERROR: cards.json not found!");
// });

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

// fetch('https://raw.githubusercontent.com/AndyBlocker/3k-tiny-game/main/json/events.json').then(response => {
//   if (!response.ok) {
//     throw new Error("HTTP error " + response.status);
//   }
//   return response.json();
// }).then(json => {
//   allEvents = json;
//   startEvent(currentEventId);
// }).catch(function () {
//   this.dataError = true;
//   console.log("ERROR: events.json not found!");
// });

document.querySelector('.hintPrompt').addEventListener('click', () => {
  document.querySelector('.hintText').style.display = 'initial';
})





startEvent(currentEventId);
deck.forEach(addCardToContainer);
updateCardVisibility();