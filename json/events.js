var allEvents = {
    "434":
    {
        "type": "input",
        "description": "This is a description of event 434.",
        "descriptionNoJ": "event 434无J描述。",
        "descriptionNoM": "你没有钱啦！但是没关系，因为你也没有输入框了！",
        "descriptionNoJM": "event 434无钱无J描述。",
        "hintText": "Correct input: 1 or testCard, easter egg input: 2",
        "getCards": ["testCard", "100", "101", "102"],
        "correctPrompt": ["testCard", "1"],
        "easterEggPrompt": {
            "2": "WOW! YOU TYPED THE EASTER EGG!!"
        },
        "nextEvent": "sample-choice"
    },
    "sample-choice":
    {
        "type": "output",
        "description": "This event has two choices",
        "choices": [
            {
                "buttonPrompt": "Go back to 434",
                "nextEvent": "434"
            },
            {
                "buttonPrompt": "Go to next event",
                "nextEvent": "1"
            }
        ]
    },
    "1":
    {
        "type": "output",
        "description": "该事件在无爱J时会有特殊描述。在持有卡牌111时也会有特殊描述（用debug区域加后刷新一下）",
        "specialDescription": true,
        "buttonPrompt": "Go back to 434",
        "nextEvent": "434"
    },
    "0":
    {
        "type": "output",
        "description": "这是一个开始事件，它表示游戏从此开始。",
        "hintText": "Correct input: 1000",
        "correctPrompt": "1000",
        "nextEvent": "1000"
    },
    "1000":
    {
        "type": "input",
        "description": "这是事件1000，你会在此获得一张一笔兔。这个事件是用来展示获得卡片和一笔兔的立绘的。点击按钮可以获得一笔兔，然后输入1000进入下一个事件。",
        "hintText": "输入1000",
        "correctPrompt": "1000",
        "getCards": ["585"],
        "nextEvent": "2000"
    },
    "2000":
    {
        "type": "input",
        "description": "这是事件2000，你会在此失去一笔兔。这个事件是用来展示失去卡片的。输入1000进入下一个事件。",
        "hintText": "输入1000",
        "correctPrompt": "1000",
        "loseCards": ["585"],
        "nextEvent": "3000"
    },
    "3000":
    {
        "type": "input",
        "description": "结束了，但仍然会显示一笔兔。随便输入些什么也许会进入其他的事件。理论上这里应该结束了，但还不知道游戏结束的时候界面是什么样子的。",
        "hintText": "no hints.",
        "correctPrompt": "434",
        "getCards": ["1", "2", "3", "585"],
        "nextEvent": "434"
    },
}

var GetSpecialEventDesc = {
    "1": () => {
        if (branch.j && branch.l) {
            return "目前处于无爱J线";
        }
        else if (deck.includes("111")) {
            return "你有一张卡牌111";
        }
        return undefined;
    }
}