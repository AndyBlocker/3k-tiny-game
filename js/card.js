/*
    ===== Card和Event共用，这个部分多的话就拆出去 =====
*/

function loadDataAndBoot(dataType, path, attributes, callback) {
    // TODO: 上传到wikidot之后要改链接？github有点慢并且有可能被墙
    fetch(JSON_PATH + path).then(response => {
        if (!response.ok) {
        throw new Error("HTTP error " + response.status);
        }
        return response.json();
    }).then(json => {
        const populatedData = populateInheritedData(dataType, json, attributesCommon.concat(attributes));
        callback(populatedData);
    }).catch(function () {
        this.dataError = true;
        console.log("ERROR: " + path + " not found!");
        window.alert("未能读取" + path + "！如果你看到这个弹窗，请告知");
    });
}

function populateInheritedData(type, obj, attributes) {
    for (var key in obj){
        const element = obj[key];
        if (element.parent){
            const parent = obj[element.parent];
            if (parent == undefined) {
                console.log( "WARNING: " + ((type == DATA_TYPES.Card) && '卡牌' || '事件') + key + 
                "被设置为" + element.parent + "的变种，但未找到" + element.parent + "的数据！" );
            }
            else {
                let newData = element;
                attributes.forEach( (attr) => {
                    if (newData[attr] == undefined && parent[attr] != undefined) {
                        newData[attr] = parent[attr];
                    }
                });
               obj[key] = newData;
            }
        }
    }
    return obj;
}

function getDescription(id, type) {
    const obj = (type == DATA_TYPES.Card) && allCards || allEvents;
    const data = obj[id];

    if (data == undefined || data.description == undefined) {
        return "未找到" + ((type == DATA_TYPES.Card) && '卡牌' || '事件') + "信息！ID：" + id;
    }

    if (data.specialDescription){
        // 特殊事件描述
        if (type == DATA_TYPES.Event && GetSpecialEventDesc[id] != undefined && GetSpecialEventDesc[id]() != undefined){
            return GetSpecialEventDesc[id]();
        }
    }

    if (branch.j && branch.l && data.descriptionNoJL) {
        return data.descriptionNoJL;
    }
    else if (branch.j && data.descriptionNoJ != undefined) {
        return data.descriptionNoJ;
    }
    else if (branch.l && data.descriptionNoL != undefined) {
        return data.descriptionNoL;
    }
    else {
        if (branch.j && branch.l && type == DATA_TYPES.Card){
            // 卡牌无爱无J默认返回统一描述
            return DEFAULT_CLINICAL_VAGUE_DESC;
        }

        return data.description;
    }
}

/*
    ===== 有关card对象CRUD等操作的接口 =====
*/

/*
function getCardDescription(id) {
    const card = allCards[id];
    if (card == undefined || card.description == undefined) {
        return "未找到卡牌信息！ID：" + id;
    }

    if (branch.j && branch.l) {
        return card.descriptionNoJL || DEFAULT_CLINICAL_VAGUE_DESC;
    }
    else if (branch.j && card.descriptionNoJ != undefined) {
        return card.descriptionNoJ;
    }
    else if (branch.l && card.descriptionNoL != undefined) {
        return card.descriptionNoL;
    }
    else {
        return card.description;
    }
}
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
        if (deck.includes(card)) {
            deck.splice(deck.indexOf(card), 1);
            popCardFromContainer(cardContainer, card);
        }
    });
    currentStartIndex = Math.max(0, deck.length - maxCardsToShow);
    updateCardVisibility();
}

// 清空card
function refreshCardContainer() {
    popAllChildElement(cardContainer);
    deck.forEach(addCardToContainer);
    updateCardVisibility();
}

function checkDeck(cardList) {
    let newCards = [];
    for (var i = 0; i < cardList.length; i++) {
        if (!deck.includes(cardList[i])) {
            newCards.push(cardList[i]);
        }
    }
    return newCards;
}