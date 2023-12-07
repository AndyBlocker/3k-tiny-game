/*
    ===== 有关card对象CRUD等操作的接口 =====
*/

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

// 添加一张card
function addCardToDeck(cardId, options) {
    deck.push(cardId);
    addCardToContainer(cardId, options);
    currentStartIndex = Math.max(0, deck.length - maxCardsToShow);
    updateCardVisibility();
}

// 清空card
function refreshCardContainer() {
    popAllChildElement(cardContainer);
    deck.forEach(addCardToContainer);
    updateCardVisibility();
}

