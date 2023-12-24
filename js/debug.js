/* 
    ===== DEV AREA =====
*/

// DEV: 这里定义的方法和全局变量应当有dev_前缀，正式游戏中不应该调用任何dev_方法。如果有需要，则应该把方法放在其他js文件中

const globalEval = eval; // A reference to eval() in topmost level so that it can modify global variables
if (DEV) {
    document.querySelector('.dev-area').style.display = 'initial';
    // print("123");

    document.querySelector('.add-card').addEventListener('click', () => {
        const inputBox = document.getElementById('dev-add-card-box');
        const id = inputBox.value;
        if (id != undefined && id != "" && !deck.includes(id)) {
            inputBox.value = "";
            addCardToDeck(id);
        }
        else {
            addCardToDeck(deck.length + 1);
        }
    });

    document.querySelector('.goto-event').addEventListener('click', () => {
        const inputBox = document.getElementById('dev-goto-event-box');
        const id = inputBox.value;
        const options = { isRefresh: true };
        if (id != undefined && id != "") {
            inputBox.value = "";
            startEvent(id, options);
        }
    });

    document.getElementById('dev-toggle-branch').addEventListener('click', () => {
        let checkboxes = document.getElementsByName("dev-choose-branch");
        const options = { isRefresh: true };
        branch.j = checkboxes[0].checked;
        branch.d = checkboxes[1].checked;
        branch.l = checkboxes[2].checked;
        branch.m = checkboxes[3].checked;

        if (branch.d) {
            document.querySelector('.content').classList.add("no-dream");
        }
        else {
            document.querySelector('.content').classList.remove("no-dream");
        }
        startEvent(currentEventId, options);
        refreshCardContainer();
    });

    /* 
      ===== Hot Load New Data =====
    */
    const dev_dataTypeDesc = {
        "card": {
            varName: 'allCards',
            filepath: 'cards.json',
            defaultText: '"type": "SCP",\n"objClass": "Safe",\n"description": "Card 1. Object Class: Safe",\n ......',
        },
        "event": {
            varName: 'allEvents',
            filepath: 'events.json',
            defaultText: '"type": "input",\n"description": "This is a description of event 434."\n"hintText": "This is the hint"\n"getCards": ["testCard", "100"],\n ......',

        }
    };
    let dirtyMarker = {
        "card": {
            single: [],
            all: false
        },
        "event": {
            single: [],
            all: false
        }
    };

    let _dataType, _replaceAll;
    function dev_toggleEvalInput(dataType, replaceAll) {
        _dataType = dataType;
        _replaceAll = replaceAll;
        const fileHeader = document.getElementById('dev-eval-file');
        const keyHeader = document.getElementById('dev-eval-key');
        const keyEnd = document.getElementById('dev-eval-end');
        const inputArea = document.getElementById('dev-eval-content');
        if (_replaceAll) {
            fileHeader.style.display = 'initial';
            keyHeader.style.display = 'none';
            keyEnd.innerText = '\n';
            inputArea.setAttribute("placeholder", '');
        }
        else {
            fileHeader.style.display = 'none';
            keyHeader.style.display = 'initial';
            keyEnd.innerText = '},';
            inputArea.setAttribute("placeholder", dev_dataTypeDesc[_dataType].defaultText);
        }
        document.getElementById('dev-eval-path').innerText = dev_dataTypeDesc[_dataType].filepath;
    }
    
    dev_toggleEvalInput('event', false);

    document.getElementById('dev-clear-input').addEventListener('click', () => {
        document.getElementById('dev-eval-title').value = '';
        document.getElementById('dev-eval-content').value = '';
    });

    /*
    // Unused: These are for js file reading.

    function dev_tryExecute(text, callback) {
        try {
            globalEval(text);
            callback();
        } catch (e) {
            if (e instanceof SyntaxError) {
                window.alert("输入存在语法错误！");
            }
        }
    }

    function dev_changeSingleJS(key, text) {
        let fullText = dev_dataTypeDesc[_dataType].varName + '["' + key + '"] = {' + text + '}';
        dev_tryExecute(fullText, () => {
            let dirtyList = dirtyMarker[_dataType].single;
            if (!dirtyList.includes(key)) {
                dirtyList.push(key);
            }
        });
    }
    */

    function dev_loadJSONStr(text, callback) {
        try {
            const obj = JSON.parse(text);
            callback();
            return obj;
        } catch (e) {
            window.alert("载入失败！请检查语法错误");
        }
    }

    function dev_replaceAll(text) {
        let callback = () => { dirtyMarker[_dataType].all = true};
        //dev_tryExecute(text.slice(3), //Remove the var identifier
        //callback);

        const json = dev_loadJSONStr(text, callback);

        if (_dataType == "card"){
            allCards = populateInheritedData(DATA_TYPES.Card, json, attributesCommon.concat(attributesCard));
        }
        else {
            allEvents = populateInheritedData(DATA_TYPES.Event, json, attributesCommon.concat(attributesEvent));
        }
    }

    function dev_changeSingle(key, text) {
        if (key == undefined || key == '') {
            window.alert("ID不能为空！");
            return;
        }

        // dev_changeSingleJS(key, text);

        let callback = () => {
            let dirtyList = dirtyMarker[_dataType].single;
            if (!dirtyList.includes(key)) {
                dirtyList.push(key);
            }
        }

        const json = dev_loadJSONStr('{' + text + '}', callback);

        if (_dataType == "card"){
            allCards[key] = json;
            allCards =  populateInheritedData(DATA_TYPES.Card, allCards, attributesCommon.concat(attributesCard));
        }
        else {
            allEvents[key] = json;
            allEvents = populateInheritedData(DATA_TYPES.Event, json, attributesCommon.concat(attributesEvent));
        }
    }

    document.getElementById('dev-load-data').addEventListener('click', () => {
        const key = document.getElementById('dev-eval-title').value;
        const text = document.getElementById('dev-eval-content').value;
        const options = { isRefresh: true };
        if (_replaceAll) {
            dev_replaceAll(text);
        }
        else {
            dev_changeSingle(key, text);
        }
        startEvent(currentEventId, options);
        refreshCardContainer();
    });

}
else {
    document.querySelector('.dev-area').style.display = 'none';
}