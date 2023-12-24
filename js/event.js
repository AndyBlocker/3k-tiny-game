/*
    ===== 有关事件&提示的接口 =====
*/

function setupHint(event) {
    const hintPrompt1 = document.getElementById('hintPrompt1');
    const hintPrompt2 = document.getElementById('hintPrompt2');
    hintText1.style.display = 'none';
    hintPrompt2.style.display = 'none';
    hintText2.style.display = 'none';

    if (event == undefined || event.hintText == undefined) {
        hintPrompt1.style.display = 'none';
    }
    else {
        hintPrompt1.style.display = 'initial';
        hintText1.innerHTML = event.hintText;
        hintText2.innerHTML = event.hintText2 ? event.hintText2 : '';
    }
}

function tryAddEasterEggDescription(easterEggID, text) {
    const descriptionArea = document.querySelector('.text-container');
    let childs = descriptionArea.childNodes;
    for (var i = 0; i < childs.length; i++) {
        if (childs[i].name == easterEggID) {
            playErrorAnimation();
            return;
        }
    }

    const newLine = document.createElement('p');
    newLine.innerHTML = text;
    newLine.name = easterEggID;
    descriptionArea.appendChild(newLine);
}

function getNextEvent(input, event, id) {
    const specialNext = tryEventSpecialFunc(id, GetSpecialNextEvent, { input: input }, event.parent);
    if (specialNext) {
        return specialNext;
    }
    return event.nextEvent;
}

function getUseResult(input, event, id, onProceed) {
    const nextEvent = getNextEvent(input, event, id);
    if (nextEvent == undefined) {
        return;
    }
    else if (nextEvent == "wrong") {
        playErrorAnimation();
        return;
    }
    const correctPrompt = event.correctPrompt;
    const easterEggPrompt = event.easterEggPrompt;

    if (correctPrompt == undefined ||
        correctPrompt == input ||
        (Array.isArray(correctPrompt) && correctPrompt.includes(input))) {
            onProceed(nextEvent);
    }
    else if (easterEggPrompt && easterEggPrompt[input] != undefined) {
        tryAddEasterEggDescription(input, easterEggPrompt[input]);
    }
    else {
        playErrorAnimation();
    }
}

function startEvent(eventId, options) {
    const previousEventId = currentEventId;
    completedEvents.push(previousEventId);

    currentEventId = eventId;
    options = options ? options : {};

    const event = allEvents[eventId];
    if (event){
        tryEventSpecialFunc(eventId, GetSpecialOnEnter, { previousEvent: previousEventId }, event.parent);
    }
    updateSpecialCards(eventId, event);

    const color = getColor(event, DATA_TYPES.Event);
    if (event && event.displayID)
        document.querySelector('.topic').innerHTML = event.displayID;
    else
        document.querySelector('.topic').innerHTML = eventId;

    document.querySelector('.topic').style.color = color;
    document.getElementsByClassName('text-container')[0].innerHTML = getDescription(eventId, DATA_TYPES.Event);

    // if innerHTML is empty, hide the text container
    if (document.getElementsByClassName('text-container')[0].innerHTML == '') {
        document.getElementsByClassName('text-container')[0].style.display = 'none';

        if (window.innerWidth > 768)
            document.querySelector('.main-container').style.justifyContent = 'center';
    }
    else {
        document.getElementsByClassName('text-container')[0].style.display = 'initial';
        document.querySelector('.text-container').style.height = 'auto';
    }

    // update event img
    if (!branch.d && event && event.img) { // with img
        document.querySelector('.img-wrapper').src = IMAGE_PATH + event.img;
        document.querySelector('.img-container').style.display = 'flex';
    }
    else {// without img
        document.querySelector('.img-container').style.display = 'none';
        document.querySelector('.text-container').style.marginLeft = 'auto';
        document.querySelector('.text-container').style.marginRight = 'auto';
        if (window.innerWidth <= 768) {
            document.querySelector(".text-container").style.maxHeight = '100%';
        }
    }

    // update input-box color
    // document.querySelector('.input-box').style.borderColor = color;
    // document.getElementById('go').style.borderColor = color;

    document.getElementById('inputs').style.display = 'none';
    document.getElementById('outputs').style.display = 'none';

    // clear main height
    document.querySelector('.main-container').style.maxHeight = '80%';

    setupHint(event);

    function onProceed(nextEventId) {
        startEvent(nextEventId);
    }

    const hasLoot = setupLootArea(event, () => {
        setupInOutArea(event, eventId, color, onProceed);
    });
    if (!hasLoot) {
        setupInOutArea(event, eventId, color, onProceed);
    }
    if (event && event.loseCards != undefined) {
        loseCards(event.loseCards);
    }

}


/*
    ===== 特殊事件相关 =====
*/

function tryEventSpecialFunc(id, FuncArray, args, parent){
    if (FuncArray[id] != undefined && FuncArray[id](args) != undefined){
        return FuncArray[id](args);
    }
    else if (parent && FuncArray[parent] != undefined && FuncArray[parent](args) != undefined){
        return FuncArray[parent](args);
    }
    return undefined;
}

const GetSpecialEventDesc = {
    "13": (args) => {
        if (!branch.d && !branch.l && !branch.m){ //三有
            return undefined;
        }

        let text = "在这个庞大且诡异、总让你觉得是宜家豪华山寨版的“超级异常家具城”里，你唯一的线索就是刚才那个令人火大的声音。所幸它还在很有情调地哼着一些没有情调的小曲，你顺着音乐的声音，找到了家具城卫浴区的……一个白色的马桶，附带自动冲水感应装置和加热马桶圈。\n\n一个空灵且清澈的声音从马桶深处响起：“年轻的旅人，我是马桶蓄水池之神。请问你刚刚在这里掉落的是金色的SCP-CN-3000，还是银色的SCP-CN-3000？”\n\n你思考了一下，说是普通的SCP-CN-3000。\n\n“真诚实……个屁！”\n\n空灵的声音立刻转为戏谑的语调。\n\n“你离获得3000还早着呢！";
        if (!branch.d && branch.l && !branch.m) {//无爱
            text += "而且你还把拓麻歌子收容了，那你和异常的交流能力就会回到基金会员工平均水平，基本就是说一句话能踩中人家异常五个雷的程度，所以你们的收容工作才搞不好啊！\n\n “"
        }
        text += "不过，我也不是不讲道理的马桶蓄水池之神。和我玩故事接龙吧，主题就叫‘关于我寻找SCP-CN-3000那档子事’！"

        if (branch.d && !branch.l && branch.m) {//无钱梦
            text += "”\n\n这个声音突然沉默了一会儿，然后重新开口说：\n\n“等会儿，玩不了啊！你把钱包收容了，现在没输入框了，你讲个屁的故事啊。再加上鲨鱼也被你收容了，现在整个游戏的图都没了！那没办法了，你就搁那儿干看字吧。”"
            return text;
        }
        else{
            text += "我们交替着讲，如果你让我没故事可讲了，那你就赢了，我会把3000给你。"

            if (branch.d && branch.l && branch.m) {//三无
                text += "”\n\n“等会儿……你已经把剩下三个兄弟全收容了啊？那现在这游戏，要游戏性没游戏性，要UI没UI，要联动没联动，这不是快完蛋了嘛！唉，算了，那现在剩下的也只有文字了，你就当看看故事吧。也别搞啥故事接龙了，你没那条件……”";
            }
            else if (!branch.d && branch.l && branch.m) {//无钱爱
                text += "”\n\n“等会儿，不对，你已经输了，你把钱包收容了，输入框没了啊！加上你把拓麻歌子也收容了，那你的卡片描述里只剩下我写的一句话吐槽了呀。”\n\n“诶唷，你，这，我也不能直接把3000塞给你吧！”\n\n其实也不是不行。\n\n“唉，这样吧，你就看着故事进展吧，然后随便点两下按钮好了，3000这种东西，直接给你就会显得很掉价……”";
            }
            else if (!branch.d && !branch.l && branch.m) {//无钱
                text += "”\n\n“诶唷，你把钱包那家伙收容了啊！那你别说讲故事了，你连输入框都没了啊。咦，那我岂不是不战而胜了？”很显然，这个声音仗着你无法反驳，开始不停地说一些嘲讽的话。\n\n“仔细想想还是太欺负你了。唉，没办法，你就接着看下去吧，反正也不可能不给你3000对吧……”";
            }
            else {
                text += "哦，忘了，你没法讲故事来着……那你就去家具城里找点好东西吧，什么小道具都行。\n\n“"
                if (branch.d && branch.l && !branch.m) {//无梦爱
                    text += "你是不是把那个画画的鲨鱼和显示东西的拓麻歌子收容了？呃……反正至少你还有个输入框吧，也不至于太难堪。好了，接下来是你的回合了！”";
                }
                else if(!branch.d && branch.l && !branch.m){//无爱
                    text += "好了，我的开头已经给出，接下来是你的回合了。”"
                }
                else if(branch.d && !branch.l && !branch.m){//无梦
                    text += "等会儿，你是不是把那个拿画板的摸鱼怪收容了？那你拿到小道具都看不到图片啊，睁眼瞎啊属于是。唉，没办法，只能多给你描述一点了，我好心吧。\n\n“好了，我的开头已经给出，接下来是你的回合了。”";
                }
            }
        }
        return text;
    },
    "14": (args) => {
        if (branch.m){
            return "虽然是胡闹一样的开场，但你也只能硬着头皮答应了下来。毕竟在基金会内部，陪着异常玩过家家的事情也不在少数。反正你现在也没有输入框了，那就来啥拿啥，出啥点啥，一路平推过去就好。\n\n当然……来啥拿啥，前提是要“来”。所以你还是得先在这片区域转转，看看有没有什么值得注意的东西。你好不容易在卫浴区找到了一个马桶搋子，还有一根不知道是谁放在这里的鱼竿（难道有人喜欢在浴缸或者马桶水里钓鱼吗）。你摸了摸裤兜，发现了自己的手机，然而上面只有一张家具城的大致分区平面图，以及一些奇怪的图案，眼睛、电池一类的。你研究了一下平面图，发现卫浴区的边缘还有一个内嵌式药房，理所当然没有开门。你只从铁栏杆的缝隙里顺到一板药片，药片板背面写着“dado的二次元药”。\n\n先从和马桶最相关的东西试起吧。";
        }
        return undefined;
    },
    "15": (args) => {
        if (branch.m){
            return "你尬住了。现在你的手上只有一堆意义不明的道具，甚至还有一个可以增加意义不明道具的鱼竿。你大可再吃一粒药对着马桶来一拳，但这也就顶多能把马桶打进一维，并没有什么实质性的作用。你的3000寻找之旅就要终结在厕所里了。\n\n“哎哟，这就没思路了？点按钮都点不利索？要不要我拿3000来安慰一下你受伤的小心灵？”\n\n马桶地砖的缝隙里传出了熟悉的声音，你在脑中迅速拟出了120种骂它的词汇。\n\n“别骂人啊！这样吧，我给你点提示。你手里那个爪子，其实是一个非常厉害的道具！它可以召唤不存在于家具城的，快乐的SCP项目们。只要用它夹住一个物品，就可以让这个物品也变得欢乐起来。反正你也没有输入框，那只能我帮你操作咯……”\n\n“好了好了，接下来是教学关卡！先用马桶碎片试试吧！”";
        }
        return undefined;
    },
    "1302": (args) => {
        if (branch.m){
            return "机械爪以一种你不太能理解的方式“夹”住了正在循环播放的爆炸动画。循环播放停止了，炸弹在发出闪光的那一刻化作一颗小型陨石，飞进了你的手机。你发现了一个有着像素炸弹图标的app。app提示你还有大概三百多个炸弹的库存，你也不知道它是怎么换算的。这个app似乎还支持充钱买更多的炸弹，可惜你已经把自己的钱包收容了，买不了。但三百多个炸弹怎么也够用了吧！\n\n你还有一个物品没有尝试转换。";
        }
        return undefined;
    },
    "1302-2": (args) => {
        if (branch.m){
            return GetSpecialEventDesc["1302"] + "\n\n你还有一个物品没有尝试转换。";
        }
        return undefined;
    }
}

const GetSpecialNextEvent = {
    "15": (args) => {
        const input = args.input;
        if (input == "984" || input == "1302") {
            return input;
        }
        return "wrong";
    },
    "343": (args) => {
        const input = args.input;
        if (input == "1014" || input == "1091") {
            return input;
        }
        return "wrong";
    }
}

const GetSpecialOnEnter = {
    "2": (args) => {
        const previousEvent = args.previousEvent;

        switch (previousEvent) {
            case "3000-Dream":
                document.querySelector('.content').classList.add("no-dream");
                branch.d = true;
                break;
            case "3000-J":
                branch.j = true;
                break;
            case "3000-money-a":
            case "3000-money-b":
            case "3000-money-c":
                branch.m = true;
                break;
            case "3000-love":
                branch.l;
                break;
            default:
                return;
        }

        // 重置部分游戏状态
        specialCardsData[PURSE_CARD_ID].value = 0;

        // 删除所有非天王卡
        let newDeck = [];
        deck.forEach( (id) => {
            if (allCards[id] && (allCards[id].color == "Boss" || allCards[id].color == "boss")) {
                newDeck.push(id);
            }
        } )
        deck = newDeck;
        refreshCardContainer();

        // 弹RAISA
        displayRAISA(previousEvent, "占位，你刚刚完成了" + previousEvent);
    }
}