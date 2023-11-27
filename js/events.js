var allEvents = {
    "434":
    {
        "type": "input",
        "description": "This is a description of event 434.",
        "getCards": ["testCard", "100", "101", "102"],
        "correctPrompt": {
            "testCard": "Correct answer prompt for testCard",
            "1": "Correct answer prompt for 2"
        },
        "wrongPrompt": "You typed in the wrong answer!",
        "easterEggPrompt" : {
            "2" : "WOW! YOU TYPED THE EASTER EGG!!"
        },
        "nextEvent": "1"
    },
    "1":
    {
        "type": "output",
        "description": "This is a description of event 1.",
        "buttonPrompt": "Go back to 434",
        "nextEvent": "434"
    }
}