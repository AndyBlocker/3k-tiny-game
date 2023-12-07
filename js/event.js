/*
    ===== 有关事件&提示的接口 =====
*/

function getEventDescription(id) {
    const event = allEvents[id];
    if (event == undefined || event.description == undefined) {
        return "未找到事件信息！ID：" + id;
    }

    if (event.specialDescription && GetSpecialEventDesc[id] != undefined && GetSpecialEventDesc[id]() != undefined) {
        return GetSpecialEventDesc[id]();
    }
    if (branch.j && branch.m) {
        return event.descriptionNoJM;
    }
    else if (branch.m && event.descriptionNoM != undefined) {
        return event.descriptionNoM;
    }
    else if (branch.j && event.descriptionNoJ != undefined) {
        return event.descriptionNoJ;
    }
    else {
        return event.description;
    }
}

function setupHint(event) {
    const hintPrompt = document.querySelector('.hintPrompt');
    const hintText = document.querySelector('.hintText');
    hintText.style.display = 'none';

    if (event == undefined || event.hintText == undefined) {
        hintPrompt.style.display = 'none';
    }
    else {
        hintPrompt.style.display = 'initial';
        hintText.innerText = event.hintText;
    }
}

