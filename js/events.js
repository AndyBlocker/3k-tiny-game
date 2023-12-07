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
        "easterEggPrompt" : {
            "2" : "WOW! YOU TYPED THE EASTER EGG!!"
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
        "description": "This is a description of event 1.",
        "buttonPrompt": "Go back to 434",
        "nextEvent": "434"
    }
}