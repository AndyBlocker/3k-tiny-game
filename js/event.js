/*
    ===== 有关事件&提示的接口 =====
*/

function getCal1DefaultText(event, eventId) {
    if (!event) {
        return '';
    }
    else if (event.cal1 || event.cal1 == ''){
        return event.cal1;
    }
    else {
        return event.displayID ? event.displayID : eventId;
    }
}

function getEventType(event) {
    if (event == undefined || !event.type) {
        return EVENT_TYPES.Output;
    }

    switch (event.type.toLowerCase()) {
        case "output":
            return EVENT_TYPES.Output;
        case "input":
            return EVENT_TYPES.Input;
        case "fourinputs":
            return EVENT_TYPES.MultiInput;
        case "end":
            return EVENT_TYPES.End;
        default:
            return EVENT_TYPES.Output;
    }
}

function setupHint(event) {
    const hintPrompt1 = document.getElementById('hintPrompt1');
    const hintPrompt2 = document.getElementById('hintPrompt2');
    hintText1.style.display = 'none';
    hintPrompt2.style.display = 'none';
    hintText2.style.display = 'none';
    if (branch.m || event == undefined || event.hintText == undefined) {
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
            playErrorAnimation(document.getElementById('input-box'));
            return;
        }
    }
    const newLine = document.createElement('p');
    newLine.innerHTML = text;
    newLine.name = easterEggID;
    descriptionArea.appendChild(newLine);
}

function getNextEvent(input, event, id) {
    const specialNext = tryEventSpecialFunc(id, "specialNextEvent", GetSpecialNextEvent, { input: input });
    if (specialNext) {
        return specialNext;
    }
    return event.nextEvent;
}

function getUseResult(input, event, id) {
    const inputBox = document.getElementById('input-box');
    const correctPrompt = event.correctPrompt;
    const easterEggPrompt = event.easterEggPrompt;

    if (easterEggPrompt && easterEggPrompt[input] != undefined) {
        tryAddEasterEggDescription(input, easterEggPrompt[input]);
    }
    else if (correctPrompt == undefined ||
        correctPrompt == input ||
        (Array.isArray(correctPrompt) && correctPrompt.includes(input))) {
        const nextEvent = getNextEvent(input, event, id);
        startEvent(nextEvent);
    }
    else {
        playErrorAnimation(inputBox);
    }
}

function startEvent(eventId, options) {
    options = options ? options : {};
    const previousEventId = options.previousEvent ? options.previousEvent : currentEventId;
    const event = allEvents[eventId];

    // clear all drags
    const dragElements = document.querySelectorAll('[class*="-drag"]');

    dragElements.forEach(element => {
        element.parentNode.removeChild(element);
    });

    // Start Event
    completedEvents.push(previousEventId);
    currentEventId = eventId;

    if (event) {
        const result = tryEventSpecialFunc(eventId, "specialOnEnter", GetSpecialOnEnter, { previousEvent: previousEventId });
        if (result && result.jumpTo && result.jumpTo != eventId) {
            startEvent(result.jumpTo, options);
            return;
        }
    }
    updateSpecialCards(eventId, event);

    const color = getColor(event, DATA_TYPES.Event);
    if (event && event.displayID)
        document.querySelector('.topic').innerHTML = event.displayID;
    else
        document.querySelector('.topic').innerHTML = eventId;

    document.querySelector('.topic').style.color = color;
    
    const isResonance = event && event.resonance;
    if (isResonance){
        const proceedElement = getEventType(event) == EVENT_TYPES.End ? document.getElementById('end-link') : document.getElementById('outputs');
        prepareFadeIn(proceedElement);
        typingAnimation(document.getElementsByClassName('text-container')[0], getDescription(eventId, DATA_TYPES.Event), TYPE_ANIM_SPEED, () => {
            setupInOutArea(event, eventId, color);
            fadeIn(proceedElement);
        });
    }
    else
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

    document.getElementById('inputs').style.display = 'none';
    document.getElementById('outputs').style.display = 'none';
    document.getElementById('multiple-inputs').style.display = 'none';
    document.getElementById('end-link').style.display = 'none';

    // clear main height
    document.querySelector('.main-container').style.maxHeight = '80%';

    setupHint(event);

    const hasLoot = setupLootArea(event, () => {
        setupInOutArea(event, eventId, color);
    });
    if (!hasLoot && !isResonance) {
        setupInOutArea(event, eventId, color);
    }
    if (event && event.loseCards) {
        loseCards(event.loseCards);
    }

    prefetchNextImg(event, eventId);
}


/*
    ===== 特殊事件相关 =====
*/

function tryEventSpecialFunc(id, attr, FuncArray, args) {
    const event = allEvents[id];
    if (!event || !event[attr]) {
        return undefined;
    }
    if (FuncArray[id] != undefined) {
        const result = FuncArray[id](args, id);
        if (result) {
            return result;
        }
    }
    const parent = event.parent;
    if (parent && FuncArray[parent] != undefined) {
        return FuncArray[parent](args, id);
    }
    return undefined;
}

const GetSpecialEventDesc = {
    "13": (args) => {
        if (!branch.d && !branch.l && !branch.m) { //三有
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
        else {
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
                else if (!branch.d && branch.l && !branch.m) {//无爱
                    text += "好了，我的开头已经给出，接下来是你的回合了。”"
                }
                else if (branch.d && !branch.l && !branch.m) {//无梦
                    text += "等会儿，你是不是把那个拿画板的摸鱼怪收容了？那你拿到小道具都看不到图片啊，睁眼瞎啊属于是。唉，没办法，只能多给你描述一点了，我好心吧。\n\n“好了，我的开头已经给出，接下来是你的回合了。”";
                }
            }
        }
        return text;
    },
    "14": (args) => {
        if (branch.m) {
            return "虽然是胡闹一样的开场，但你也只能硬着头皮答应了下来。毕竟在基金会内部，陪着异常玩过家家的事情也不在少数。反正你现在也没有输入框了，那就来啥拿啥，出啥点啥，一路平推过去就好。\n\n当然……来啥拿啥，前提是要“来”。所以你还是得先在这片区域转转，看看有没有什么值得注意的东西。你好不容易在卫浴区找到了一个马桶搋子，还有一根不知道是谁放在这里的鱼竿（难道有人喜欢在浴缸或者马桶水里钓鱼吗）。你摸了摸裤兜，发现了自己的手机，然而上面只有一张家具城的大致分区平面图，以及一些奇怪的图案，眼睛、电池一类的。你研究了一下平面图，发现卫浴区的边缘还有一个内嵌式药房，理所当然没有开门。你只从铁栏杆的缝隙里顺到一板药片，药片板背面写着“dado的二次元药”。\n\n先从和马桶最相关的东西试起吧。";
        }
        return undefined;
    },
    "15": (args) => {
        if (branch.m) {
            return "你尬住了。现在你的手上只有一堆意义不明的道具，甚至还有一个可以增加意义不明道具的鱼竿。你大可再吃一粒药对着马桶来一拳，但这也就顶多能把马桶打进一维，并没有什么实质性的作用。你的3000寻找之旅就要终结在厕所里了。\n\n“哎哟，这就没思路了？点按钮都点不利索？要不要我拿3000来安慰一下你受伤的小心灵？”\n\n马桶地砖的缝隙里传出了熟悉的声音，你在脑中迅速拟出了120种骂它的词汇。\n\n“别骂人啊！这样吧，我给你点提示。你手里那个爪子，其实是一个非常厉害的道具！它可以召唤不存在于家具城的，快乐的SCP项目们。只要用它夹住一个物品，就可以让这个物品也变得欢乐起来。反正你也没有输入框，那只能我帮你操作咯……”\n\n“好了好了，接下来是教学关卡！先用马桶碎片试试吧！”";
        }
        return undefined;
    },
    "1302-2": (args) => {
        if (branch.m) {
            return "机械爪以一种你不太能理解的方式“夹”住了正在循环播放的爆炸动画。循环播放停止了，炸弹在发出闪光的那一刻化作一颗小型陨石，飞进了你的手机。你发现了一个有着像素炸弹图标的app。app提示你还有大概三百多个炸弹的库存，你也不知道它是怎么换算的。这个app似乎还支持充钱买更多的炸弹，可惜你已经把自己的钱包收容了，买不了。但三百多个炸弹怎么也够用了吧！";
        }
        return undefined;
    },
    "1302": (args) => {
        if (branch.m) {
            return GetSpecialEventDesc["1302-2"]() + "\n\n你还有一个物品没有尝试转换。";
        }
        return undefined;
    },
    "3000-J": (args) => {
        if (!branch.d && !branch.l && !branch.m) { //三有
            return undefined;
        }

        let text = "“好吧，你确实拿到3000了。那愿赌服输，故事也就在这里结束了。”\n\n你刚刚抽到的那个马桶的蓄水池盖板突然打开，从里面飞出了一个洁白的，散发着柔光的，缓慢旋转的……屎。对此你感到毫不意外。\n\n“但其实你也意识到了，我并不是SCP-CN-3000。我只是这个游戏的其中一个制作者罢了，和其他几个家伙一样。”洁白的屎平静地诉说着，你觉得它在现出真身之后说话也变得客气了许多。\n\n“";
        if (branch.d && branch.l && branch.m) { //三无
            text += "剩下几个家伙都在你手里了啊。”洁白的屎这么说道，你居然从它的声音里听出了一些寂寞。“你估计也发现了，根本没有什么SCP-CN-3000，有的只有我们几个凑在一起做的游戏。鲨鱼负责画图，我负责文案，钱包负责玩法，拓麻歌子负责联络和信息采集。还有一个……我不知道怎么形容的家伙，它其实才是一切的起点，用游戏描述的话应该是……制作人？但你还没见到，我就不剧透了。\n\n“怎么样，虽然是充满了厕所笑话和无意义吐槽的故事，但这段旅途有让你感到开心吗？虽然它也马上就要结束了。";
        }
        else {
            if (branch.m) {
                text += "钱包是个好人……好东西，它是我们之中最不善于表达的，但没了它的设计，游戏玩法就整个崩掉了。";
                if (!branch.l && !branch.d) {
                    text += "相信你也看到了。";
                }
            }
            if (branch.d) {
                text += "小鲨鱼那家伙是美术设计，它是我们几个之中唯一一个能画画的，虽然比起画画，它更喜欢拿那个绘画板打人。虽然它总是要我们催着才不情不愿地工作，但它也确实为这个游戏贡献了很多有趣的插画。";
                if (!branch.m && !branch.l) {
                    text += "可惜你是看不到了呀！";
                }
            }
            if (branch.l) {
                text += "你收容的那个拓麻歌子其实是整个游戏的联络官。没有它的提示，我其实都不知道你们还收容了这么多奇形怪状的玩意儿，也只能在卡牌上随便写点含糊的吐槽。";
            }

            if (branch.m || branch.d || branch.l) {
                text += "”它看了一眼你的收容箱，仿佛在回忆逝去的伙伴。";
            }
            text += "\n\n“那么，虽然是充满了厕所笑话和无意义吐槽的故事和已经不能称之为游戏的游戏，但这段旅途有让你感到开心吗？”洁白的屎这么说道，你居然从它的声音里听出了一些寂寞。“我毕竟是游戏的文案……别说我自夸，你收容了我之后，接下来的旅途可能就没这么有趣了。但，这就是SCP基金会吧。”";
        }
        text += "\n\n你已经将异常物品用标准收容箱拿在手上了。\n\n“最后告诉你一个秘密……其实我不是马桶蓄水池之神！马桶蓄水池没有神，也不需要神，它的精神存在于我们一分一秒的日常中！有缘再会！”\n\n说完这句话后，它就仿佛被马桶冲水一般吸进了收容箱，不再说话了。";
        return text;
    }
}

function commonMultiAnswer(args) {
    if (branch.m) {
        return undefined; //无钱没有输入框，用默认（nextEvent字段）
    }
    return args.input;
}

const GetSpecialNextEvent = {
    "15": commonMultiAnswer,
    "174": commonMultiAnswer,
    "343": commonMultiAnswer,
    "803": commonMultiAnswer,
    "2202": commonMultiAnswer,
    "649": (args) => {
        if (branch.m) {
            return "649-1";
        }
        return "649-input";
    }
}

function displayRaisaWithDataId(id) {
    const event = allEvents[id];
    if (event && event.raisaTitle) {
        displayRAISA(event.raisaTitle, event.raisaDesc);
    }
}

const GetSpecialOnEnter = {
    "0": (args, id) => {
        displayRaisaWithDataId(id);
    },
    "803": (args) => {
        if (branch.l) {
            return { jumpTo: "803-NoL" };
        }
        else {
            return { jumpTo: "803" };
        }
    },
    "648J": (args) => {
        // Init lucky draw
        _luckyDrawRemaining = LUCKY_DRAW_MAX_ATTEMPTS;
        _luckyDrawGuaranteeOccurance = getRandNumber(_luckyDrawRemaining);
        _prizeObtained = [];
        console.log("扭蛋初始化完成，在第" + (5 - _luckyDrawGuaranteeOccurance) + "抽必出保底");
    },
    "lucky-draw": (args) => {
        _luckyDrawRemaining--;
        _prizeObtained.push(args.previousEvent);

        let result = "649";
        if (_luckyDrawRemaining < 0 || luckyDrawPool.length == _prizeObtained.length) {
            // 没有扭蛋次数/奖池已空，去649或变种
            if (branch.d && !branch.m) {
                result = "649-input-noD";
            }
            else {
                result = "649";
            }
        }
        else if (!_prizeObtained.includes(luckyDrawGuaranteeEvent) && (_luckyDrawRemaining == _luckyDrawGuaranteeOccurance || _luckyDrawRemaining <= 0)) {
            result = luckyDrawGuaranteeEvent;
        }
        else {
            let nextEvent = "0";
            do {
                nextEvent = luckyDrawPool[getRandNumber(luckyDrawPool.length)];
            } while (_prizeObtained.includes(nextEvent))
            result = nextEvent;
        }
        return { jumpTo: result };
    },
    "2": (args) => {
        const previousEvent = args.previousEvent;

        switch (previousEvent) {
            case "3000-Dream":
                switchToNoDream();
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
                branch.l = true;
                break;
            default:
                break;
        }

        // 重置部分游戏状态
        specialCardsData[PURSE_CARD_ID].value = 0;

        // 删除所有非天王卡
        let newDeck = [];
        for (const id of deck) {
            if (allCards[id] && (allCards[id].color == "Boss" || allCards[id].color == "boss")) {
                newDeck.push(id);
            }
        }
        deck = newDeck;
        console.log(deck);
        refreshCardContainer();

        // 若四线完成，跳转到结局
        if (branch.j && branch.d && branch.m && branch.l) {
            displayRaisaWithDataId(args.previousEvent);
            return { jumpTo: "end-1" };
        }
        else {
            displayRaisaWithDataId(args.previousEvent);
        }
    },
    "end-8": (args, id) => {
        displayRaisaWithDataId(id);
    },
    "resonance-16": (args, id) => {
        document.getElementById('end-link').innerHTML = '<a href="' + ITERATION_2_LINK + '" target="_top">收容该异常。</a>'
    },
}