/*
    ===== Card和Event共用，这个部分多的话就拆出去 =====
*/

function loadDataAndBoot(dataType, path, attributes, callback) {
    // TODO: 上传到wikidot之后要改链接？github有点慢并且有可能被墙
    console.log("Loading " + JSON_PATH + path + "...")
    fetch(JSON_PATH + path).then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    }).then(json => {
        const populatedData = populateInheritedData(dataType, json, attributesCommon.concat(attributes));
        callback(populatedData);
    }).catch(function (e) {
        this.dataError = true;
        console.log("ERROR: " + e.message + ', when reading' + path);
        window.alert("未能读取" + path + "！如果你看到这个弹窗，请告知");
    });
}

function populateInheritedData(type, obj, attributes) {
    for (var key in obj) {
        const element = obj[key];
        if (element.parent) {
            const parent = obj[element.parent];
            if (parent == undefined) {
                console.log("WARNING: " + ((type == DATA_TYPES.Card) ? '卡牌' : '事件') + key +
                    "被设置为" + element.parent + "的变种，但未找到" + element.parent + "的数据！");
            }
            else {
                let newData = element;
                for (const attr of attributes) {
                    if (newData[attr] == undefined && parent[attr] != undefined) {
                        newData[attr] = parent[attr];
                    }
                }
                obj[key] = newData;
            }
        }
    }
    return obj;
}

function getDescription(id, type) {
    const obj = (type == DATA_TYPES.Card) ? allCards : allEvents;
    const data = obj[id];

    if (data == undefined || data.description == undefined) {
        return "未找到" + ((type == DATA_TYPES.Card) ? '卡牌' : '事件') + "信息！ID：" + id;
    }

    let extraDesc = '';
    if (data.specialDescription && type == DATA_TYPES.Event) {
        // 特殊事件描述
        const specialDesc = tryEventSpecialFunc(id, "specialDescription", GetSpecialEventDesc, {});
        if (specialDesc) {
            return specialDesc;
        }
    }
    else if (type == DATA_TYPES.Card && specialCardsData[id] && specialCardsData[id].hasExtraDesc) {
        // 会变化的卡牌描述
        if (branch.j && specialCardsData[id].descNoJ != "") {
            extraDesc = specialCardsData[id].descNoJ;
        }
        else {
            extraDesc = specialCardsData[id].desc;
        }
    }

    let desc = '';
    if (branch.j && branch.l && data.descriptionNoJL) {
        desc = data.descriptionNoJL;
    }
    else if (branch.j && data.descriptionNoJ) {
        desc = data.descriptionNoJ;
    }
    else if (branch.l && data.descriptionNoL) {
        desc = data.descriptionNoL;
    }
    else {
        if (branch.j && branch.l && type == DATA_TYPES.Event && data.descriptionNoJ) {
            desc = data.descriptionNoJ;
        }
        desc = data.description;
    }
    return desc + extraDesc;
}

// Get a random int between 0 ~ n-1
function getRandNumber(n) {
    return Math.floor(Math.random() * n);
}

/*
    ===== 有关card对象CRUD等操作的接口 =====
*/

// 添加一张card
function addCardToDeck(cardId, options) {
    deck.push(cardId);
    addCardToContainer(cardId, options);
    currentStartIndex = Math.max(0, deck.length - maxCardsToShow);
    updateCardVisibility();
}

// 从deck中删除card
function loseCards(cardList) {
    cardList.forEach(card => {
        const index = deck.indexOf(card);
        if (index !== -1) {
            deck.splice(index, 1);
            popCardFromContainer(cardContainer, card);
        }
    });
}


// 原位替换卡牌
function replaceCard(oldId, newId) {
    for (var i = 0; i < deck.length; i++) {
        if (deck[i] == oldId) {
            deck[i] = newId;
            break;
        }
    }
    replaceCardInContainer(oldId, newId);
}

// 清空card
function refreshCardContainer() {
    popAllChildElement(cardContainer);
    for (const v of deck) { addCardToContainer(v); }
    currentStartIndex = Math.max(0, deck.length - maxCardsToShow);
    updateCardVisibility();
}

// 返回没有的card
function checkDeck(cardList) {
    let newCards = [];
    for (var i = 0; i < cardList.length; i++) {
        if (!deck.includes(cardList[i])) {
            newCards.push(cardList[i]);
        }
    }
    return newCards;
}

function getCardTitle(cardId) {
    if (cardId == PET_CARD_ID || cardId == PURSE_CARD_ID) {
        const value = specialCardsData[cardId].value;
        return (value > 0 ? "+" : "") + value;
    }
    else if (allCards[cardId] && allCards[cardId].displayID) {
        return allCards[cardId].displayID;
    }
    else {
        return cardId;
    }
}

function updateSpecialCards(eventId, event) {
    if (!event) {
        return;
    }
    for (var id in specialCardsData) {
        let shouldUpdate = false;
        if (specialCardsData[id].logEvents && specialCardsData[id].logEvents.includes(eventId)) {
            if (event.bulletPoint) {
                // 更新bullet points
                specialCardsData[id].hasExtraDesc = true;
                specialCardsData[id].desc += event.bulletPoint;
                specialCardsData[id].descNoJ += event.bulletPointNoJ ? event.bulletPointNoJ : event.bulletPoint;
            }
            if (id == PET_CARD_ID) {
                specialCardsData[id].value += 250;
            }
            shouldUpdate = true;
        }
        if (id == PURSE_CARD_ID && event.newMoney) {
            specialCardsData[id].value = parseInt(event.newMoney);
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            replaceCardInContainer(id, id);
        }
    }
}