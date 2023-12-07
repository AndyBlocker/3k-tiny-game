/* 
    ===== DEV AREA =====
*/

const globalEval = eval; // A reference to eval() in topmost level so that it can modify global variables
if (DEV) {
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

    document.getElementById('dev-toggle-branch').addEventListener('click', () => {
        let checkboxes = document.getElementsByName("dev-choose-branch");
        branch.j = checkboxes[0].checked;
        branch.d = checkboxes[1].checked;
        branch.l = checkboxes[2].checked;
        branch.m = checkboxes[3].checked;
        startEvent(currentEventId);
        refreshCardContainer();
    });

    /* 
      ===== Hot Load New Data =====
    */
    const dataTypeDesc = {
        "card": {
            varName: 'allCards',
            filepath: 'cards.js',
            defaultText: '"type": "SCP",\n"objClass": "Safe",\n"description": "Card 1. Object Class: Safe",\n ......',
        },
        "event": {
            varName: 'allEvents',
            filepath: 'events.js',
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
        const inputArea = document.getElementById('dev-eval-content');
        if (_replaceAll) {
            fileHeader.style.display = 'initial';
            keyHeader.style.display = 'none';
            inputArea.setAttribute("placeholder", '');
        }
        else {
            fileHeader.style.display = 'none';
            keyHeader.style.display = 'initial';
            inputArea.setAttribute("placeholder", dataTypeDesc[_dataType].defaultText);
        }
        document.getElementById('dev-eval-path').innerText = dataTypeDesc[_dataType].filepath;
    }
    dev_toggleEvalInput('event', false);

    document.getElementById('dev-clear-input').addEventListener('click', () => {
        document.getElementById('dev-eval-title').setAttribute("placeholder", '');
        document.getElementById('dev-eval-content').setAttribute("placeholder", '');
    });

    function tryExecute(text, callback) {
        try {
            globalEval(text);
            callback();
        } catch (e) {
            if (e instanceof SyntaxError) {
                window.alert("输入存在语法错误！");
            }
        }
    }

    function changeSingle(key, text) {
        if (key == undefined || key == '') {
            window.alert("ID不能为空！");
            return;
        }
        let fullText = dataTypeDesc[_dataType].varName + '["' + key + '"] = {' + text + '}';
        tryExecute(fullText, () => {
            let dirtyList = dirtyMarker[_dataType].single;
            if (!dirtyList.includes(key)) {
                dirtyList.push(key);
            }
        });
    }

    document.getElementById('dev-load-data').addEventListener('click', () => {
        const key = document.getElementById('dev-eval-title').value;
        const text = document.getElementById('dev-eval-content').value;
        if (_replaceAll) {
            tryExecute(text.slice(3), //Remove the var identifier
                () => { dirtyMarker[_dataType].all = true; })
        }
        else {
            changeSingle(key, text);
        }
        startEvent(currentEventId);
        refreshCardContainer();
    });

}
else {
    document.querySelector('.dev-area').style.display = 'none';
}