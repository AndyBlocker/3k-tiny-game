var allEvents = {
    "434":
    {
        "type": "input",
        "description": "This is a description of event 434.",
        "hintText": "Correct input: 1 or testCard, easter egg input: 2",
        "getCards": ["testCard", "100", "101", "102"],
        "correctPrompt": ["testCard", "1"],
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