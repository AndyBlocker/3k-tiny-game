/*
   ===== FOR DEV =====
*/

let DEV = true;

function parseUrl(){
    const href = window.location.href;
    const hrefRegExp = /\?_?[A-Za-z0-9\-=/:]+/g;
    if (hrefRegExp.test(href)) {
        const arg = href.slice(href.search(hrefRegExp) + 1);
        if (arg && arg.toLowerCase() == "ship"){
            DEV = false;
        }
    }
}

parseUrl();

/*
   ===== PATHS =====
*/

const IMAGE_PATH = "./img/";
const JSON_PATH = "./json/";

// for local debug
// const IMAGE_PATH = " https://raw.githubusercontent.com/AndyBlocker/3k-tiny-game/main/img/";
// const JSON_PATH = " https://raw.githubusercontent.com/AndyBlocker/3k-tiny-game/main/json/";

/* 
    ===== TUNABLES =====
*/
const SCP_COLOR = "#FF9D95";
const PROPS_COLOR = "#CCE9FF";
const EVENT_COLOR = "#9C67B5";
const BOSS_COLOR = "#fde44c";
const CLINICAL_COLOR = "#FFFFFF";
const DEFAULT_CONTINUE_TEXT = "前往下一事件";

const ITERATION_2_LINK = "https://scp-wiki-cn.wikidot.com/scp-cn-20210401-j"

const PURSE_CARD_ID = "purse";
const PET_CARD_ID = "pet";

const LUCKY_DRAW_MAX_ATTEMPTS = 5;
const luckyDrawGuaranteeEvent = "970";
const luckyDrawPool = ["2289", "970", "937", "600", "2426"];

/* 
    ===== VARIABLES =====
*/

const cardContainer = document.querySelector('.card-container');
const lootContainer = document.getElementById('loots');
const hintText1 = document.getElementById('hintText1');
const hintText2 = document.getElementById('hintText2');

var maxCardsToShow = 4;

const attributesCommon = [
    "displayID", "description", "descriptionNoJ", "descriptionNoL", "descriptionNoJL", "color", "img"
];
const attributesEvent = [
    "type", "hintText", "getCards", "loseCards", "correctPrompt", "easterEggPrompt", "nextEvent", "choices", "buttonPrompt",
    "specialDescription", "specialNextEvent", "specialOnEnter",
    "newMoney", "bulletPoint", "bulletPointNoJ",
    "raisaTitle", "raisaDesc"
];
const attributesCard = [
    "name"
];
const DATA_TYPES = {
    Card: 0,
    Event: 1,
    __Count: 2,
};
const EVENT_TYPES = {
    Output: 0,
    Input: 1,
    MultiInput: 2,
    End: 3,
    __Count: 4,
}

/* 
    ===== GAME STATUS =====
*/
let currentEventId = "0";
let currentStartIndex = 0;
let deck = [];

let branch = {
    j: false, // J线完成情况
    d: false, // 梦线完成情况
    l: false, // 爱线完成情况
    m: false  // 钱线完成情况
};
let money = '0';
let completedEvents = [];
let specialCardsData = {
    "pet": {
        value: 250,
        hasExtraDesc: false,
        desc: "",
        descNoJ: "",
        logEvents: ["4454", "4455", "1922", "1775", "812", "765", "2297", "1061", "1818", "1819", "1296", "3000-love"]
    },
    "006J": {
        hasExtraDesc: false,
        desc: "",
        descNoJ: "",
        logEvents: ["122", "296", "048J", "321J"]
    },
    "purse": {
        value: 0
    }
}

let _lootToPick = 0;
var _luckyDrawRemaining, _luckyDrawGuaranteeOccurance, _prizeObtained;