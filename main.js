let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let width = window.innerWidth;
let height = window.innerHeight;
canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);

let singleEnabled = !false;

const version = "1w24g";

if (window.location.href.includes("?eraseCache=true")) {
    window.location = window.location.href.split("?")[0];
}
let cachedVersion = localStorage.getItem("version");
if (cachedVersion !== version) {
    localStorage.setItem("version", version);
    window.location = window.location.href+"?eraseCache=true";
}

let images = {};

async function loadImages() {
    let imageList = ["stork","badger","goat","cat","rabbit","sheep","pig","cow","horse","smallDog","bigDog","wolf","fox",
    "chicken","rooster","eagle","snake","shadowBeast","arrow","arrowNo","arrowHover","bear","bee","honey",
    "antiStork","empty","blackSheep","bag","skunk","boar","owl","bonusTurn","donkey","squirrel","pegasus","unicorn",
    "nightmare","arrowFlip","arrowNoFlip","arrowHoverFlip","lettuce","celestialDeer", "otter", "beaver", "hippocampus",
    "salmon", "pond", "frog", "turtle", "cod", "duck", "arrowFrog", "arrowFrogHover", "alpaca", "water", "antiWater",
    "celestialTalisman", "shadowTalisman", "arrowShadowHover", "arrowCelestialHover", "cheese", "milk", "mouse", "cheddar",
    "brie", "gouda", "blueCheese", "snowFox", "freeze", "seal", "iceWolf", "phoenix", "scarecrow", "crow", "pumpkin", "stick", "hay",
    "coop", "wood", "ufo"];
    return new Promise((resolve, reject) => {
        let loaded = 0;
        for (let i = 0; i < imageList.length; i++) {
            let img = new Image();
            img.src = "resources/"+imageList[i]+".png";
            img.onload = function() {
                loaded++;
                images[imageList[i]] = img;
                if (loaded == imageList.length) {
                    resolve();
                }
            }
            img.onerror = function() {
                reject();
            }
        }
    });
}

let breed1, breed2, breed3, breed4, breed5;

let state = "menu";
let playerAmount = 0;
let die1 = ["rabbit","rabbit","rabbit","rabbit","rabbit","rabbit",
            "sheep","sheep","sheep","pig","horse","wolf"];
let die2 = ["rabbit","rabbit","rabbit","rabbit","rabbit","rabbit",
            "sheep","sheep","pig","pig","cow","fox"];
let storkDie = ["stork","stork","stork","empty","empty","antiStork"];
let bagDie = ["fox", "snake", "rabbit", "eagle"];
let skunkDie = ["skunk", "snake", "empty", "rabbit", "boar", "owl"];
let nightDie = ["shadowBeast", "nightmare", "empty", "empty", "unicorn", "celestialDeer"]
let actionAnimals = ["goat", "cat", "bag", "bee", "squirrel", "donkey", "snake", "fox", "wolf", "otter",
                     "mouse", "blueCheese"];
let aquaticAnimals = ["cod", "salmon", "duck", "beaver"];
let pondDie1 = ["cod", "cod", "cod", "cod", "salmon", "salmon", "salmon", "duck", "beaver", "otter"];
let pondDie2 = ["cod", "cod", "cod", "cod", "cod", "salmon", "salmon", "duck", "duck", "hippocampus"];
let ufoAnimals = [];
for (let i = 0; i < 10; i++) {
    ufoAnimals.push("rabbit");
}
for (let i = 0; i < 8; i++) {
    ufoAnimals.push("sheep");
}
for (let i = 0; i < 6; i++) {
    ufoAnimals.push("pig");
}
for (let i = 0; i < 4; i++) {
    ufoAnimals.push("cow");
}
for (let i = 0; i < 1; i++) {
    ufoAnimals.push("horse");
}
for (let i = 0; i < 1; i++) {
    ufoAnimals.push("wolf");
}
let winner = "";

class Player {
    constructor(name) {
        this.name = name;
        this.freeze = {
            "chicken": false,
            "rabbit": false,
            "sheep": false,
            "pig": false,
            "cow": false,
            "cod": false,
            "salmon": false,
            "duck": false,
            "beaver": false,
        }
        this.animals = {
            "wood": 0,
            "coop": 0,
            "chicken": 0,
            "rooster": 0,
            "rabbit": 0,
            "sheep": 0,
            "blackSheep": 0,
            "pig": 0,
            "boar": 0,
            "cow": 0,
            "horse": 0,
            "pegasus": 0,
            "smallDog": 0,
            "bigDog": 0,
            "phoenix": 0,
            "milk": 0,
            "cheese": 0,
            "cheddar": 0,
            "brie": 0,
            "blueCheese": 0,
            "gouda": 0,
            "mouse": 0,
            "cod": 0,
            "salmon": 0,
            "duck": 0,
            "beaver": 0,
            "hippocampus": 0,
            "turtle": 0,
            "frog": 0,
            "stork": 0,
            "badger": 0,
            "owl": 0,
            "bee": 0,
            "honey": 0,
            "bonusTurn": 0,
            "water": 0,
            "stick": 0,
            "lettuce": 0,
            "hay": 0,
            "pumpkin": 0,
            "scarecrow": 0,
            "crow": 0,
            "squirrel": 0,
            "donkey": 0,
            "unicorn": 0,
            "nightmare": 0,
            "celestialTalisman": 0,
            "shadowTalisman": 0,
            "pond": 0,
            "alpaca": 0
        }
        if (addons["chicken"]) {
            this.animals["chicken"] = 1;
        } else {
            this.animals["rabbit"] = 1;
        }
        this.animalCap = {
            "bonusTurn": -1,
            "wood": -1,
            "coop": -1,
            "chicken": 32,
            "rabbit": 20,
            "sheep": 12,
            "pig": 8,
            "cow": 6,
            "horse": 4,
            "pegasus": 0,
            "smallDog": 2,
            "bigDog": 2,
            "phoenix": 4,
            "stork": 4,
            "badger": -1,
            "rooster": -1,
            "blackSheep": -1,
            "boar": -1,
            "owl": -1,
            "bee": 5,
            "honey": 6,
            "squirrel": 16,
            "donkey": -1,
            "unicorn": -1,
            "nightmare": -1,
            "celestialTalisman": -1,
            "shadowTalisman": -1,
            "lettuce": -1,
            "cod": 20,
            "salmon": 12,
            "duck": 8,
            "beaver": 6,
            "hippocampus": 4,
            "turtle": 2,
            "frog": -1,
            "pond": -1,
            "alpaca": -1,
            "water": 4,
            "milk": 4,
            "cheese": -1,
            "cheddar": -1,
            "brie": -1,
            "blueCheese": -1,
            "gouda": -1,
            "mouse": 4,
            "crow": 16,
            "scarecrow": -1,
            "pumpkin": -1,
            "stick": -1,
            "hay": -1
        }
        this.setCaps = () => {
            let capObject = {
                "chicken": 32,
                "rabbit": 20,
                "sheep": 12,
                "pig": 8,
                "cow": 6,
                "horse": 4,
                "pegasus": 0,
                "cod": 20,
                "salmon": 12,
                "duck": 8,
                "beaver": 6,
                "hippocampus": 4
            }
            for (let [animal, amount] of Object.entries(capObject)) {
                this.animalCap[animal] = Math.max(0, amount-Math.floor(this.animals["squirrel"]/4)+4*this.animals["donkey"]-2*this.animals["nightmare"]);
            }
            if (this.animals["coop"] > 0) this.animalCap["chicken"]+=8;
            this.animalCap["milk"] = 4 + this.animals["mouse"];
        }
        this.honeyDie = ["empty", "empty", "empty", "empty"]
        this.beeLevelUp = () => {
            switch (this.animals["bee"]) {
                case 1:
                    this.honeyDie = ["honey", "empty", "empty", "empty"];
                    break;
                case 2:
                    this.honeyDie = ["honey", "honey", "empty", "empty"];
                    break;
                case 3:
                    this.honeyDie = ["honey", "honey", "honey", "empty"];
                    break;
                case 4:
                    this.honeyDie = ["honey", "honey", "honey", "honey"];
                    break;
                case 5:
                    this.honeyDie = ["honey", "honey", "honey", "bonusTurn"];
                    break;
            }
        }
        this.prune = () => {
            for (let [animal, amount] of Object.entries(this.animals)) {
                if (this.animalCap[animal] != -1 && amount != "goat") {
                    this.animals[animal] = Math.min(this.animalCap[animal], amount);
                }
            }
        }
        this.tribute = {
            animal: addons["chicken"] ? "chicken" : "rabbit",
            amount: 3
        }
        this.payTribute = () => {
            this.animals[this.tribute.animal] -= 1;
            this.tribute.amount -= 1;
            if (this.tribute.amount == 0) {
                this.tribute.amount = 3;
                switch (this.tribute.animal) {
                    case "chicken":
                        this.tribute.animal = "rabbit";
                        break;
                    case "rabbit":
                        this.tribute.animal = "sheep";
                        break;
                    case "sheep":
                        this.tribute.animal = "pig";
                        break;
                    case "pig":
                        this.tribute.animal = "cow";
                        break;
                    case "cow":
                        this.tribute.animal = "horse";
                        break;
                    case "horse":
                        if (addons["pond"]) {
                            this.tribute.animal = "hippocampus";
                        } else if (addons["pegasus"]) {
                            this.tribute.animal = "pegasus";
                        } else {
                            this.tribute.animal = "win";
                        }
                        break;
                    case "hippocampus":
                        if (addons["pegasus"]) {
                            this.tribute.animal = "pegasus";
                        } else {
                            this.tribute.animal = "win";
                        }
                        break;
                    case "pegasus":
                        this.tribute.animal = "win";
                        break;
                }
                if (this.tribute.animal == "win") {
                    winner = this.name;
                    state = "end";
                    removeListeners();
                    renderBackground();
                    renderEnd();
                }
            }
        }
        this.foxAttack = () => {
            if (this.animals["blueCheese"] > 0) {
                this.animals["blueCheese"]--;
            } else if (this.animals["smallDog"] > 0) {
                this.animals["smallDog"]--;
            } else {
                this.animals["chicken"] = Math.min(1, this.animals["chicken"]);
                this.animals["rabbit"] = addons["chicken"] ? 0 : Math.min(1, this.animals["rabbit"]);
            }
            if (this.animals["phoenix"] > 0) {
                this.animals["phoenix"]--;
            } else if (addons["snowFox"]) {
                this.freeze["chicken"] = true;
                this.freeze["rabbit"] = true;
            }
            if (addons["badger"]) {
                players.forEach((player) => {
                    player.animals["badger"] = 0;
                });
                this.animals["badger"] = 1;
            }
        }
        this.wolfAttack = () => {
            if (this.animals["blueCheese"] > 0) {
                this.animals["blueCheese"]--;
            } else if (this.animals["bigDog"] > 0) {
                this.animals["bigDog"]--;
            } else {
                if (this.animals["sheep"] != "goat") this.animals["sheep"] = 0;
                if (this.animals["pig"] != "goat") this.animals["pig"] = 0;
                if (this.animals["cow"] != "goat") this.animals["cow"] = 0;
            }
            if (this.animals["phoenix"] > 0) {
                this.animals["phoenix"]--;
            } else if (addons["snowFox"]) {
                this.freeze["sheep"] = true;
                this.freeze["pig"] = true;
                this.freeze["cow"] = true;
            }
            if (addons["badger"]) {
                players.forEach((player) => {
                    player.animals["badger"] = 0;
                });
                this.animals["badger"] = 1;
            }
            for (let [animal, amount] of Object.entries(this.animals)) {
                if (amount == "goat") {
                    this.animals[animal] = 0;
                    if (playerAmount == 1) break;
                }
            }
        }
        this.otterAttack = () => {
            if (this.animals["blueCheese"] > 0) {
                this.animals["blueCheese"]--;
            } else if (this.animals["turtle"] > 0) {
                this.animals["turtle"]--;
            } else {
                this.animals["cod"] = Math.min(1, this.animals["cod"]);
                this.animals["salmon"] = 0;
                this.animals["duck"] = 0;
                this.animals["beaver"] = 0;
            }
            if (this.animals["phoenix"] > 0) {
                this.animals["phoenix"]--;
            } else if (addons["snowFox"]) {
                this.freeze["cod"] = true;
                this.freeze["salmon"] = true;
                this.freeze["duck"] = true;
                this.freeze["beaver"] = true;
            }
            this.animals["frog"]++;
        }
        this.catAttack = () => {
            this.animals["smallDog"] = 0;
            this.animals["bigDog"] = 0;
        }
        this.snakeAttack = () => {
            this.animals["rabbit"] -= Math.min(1, this.animals["rabbit"]);
        }
        this.breed = (die1, die2) => {
            let breedType = "";
            if (["chicken", "rabbit", "sheep", "pig", "cow", "horse", "fox", "wolf"].includes(die1)) {
                breedType = "farm";
            } else if (["cod", "salmon", "duck", "beaver", "hippocampus", "otter"].includes(die1)) {
                breedType = "pond";
            }
            breed1 = false;
            breed2 = false;
            breed3 = false;
            breed4 = false;
            let breedingObject = {
                "chicken": 0,
                "rabbit": 0,
                "sheep": 0,
                "pig": 0,
                "cow": 0,
                "horse": 0,
                "fox": 0,
                "wolf": 0,
                "cod": 0,
                "salmon": 0,
                "duck": 0,
                "beaver": 0,
                "hippocampus": 0,
                "otter": 0
            }
            breedingObject[die1]++;
            breedingObject[die2]++;
            if (this.animals["coop"] > 0) breedingObject["chicken"]++;
            breedingObject["pig"] += this.animals["boar"];
            for (let [animal, amount] of Object.entries(breedingObject)) {
                if (this.freeze[animal]) breedingObject[animal] = 0;
            }
            let goudaBreed = false;
            switch (breedType) {
                case "farm":
                    for (let animal of ["chicken", "rabbit", "sheep", "pig", "cow", "horse"]) {
                        if (!goudaBreed && this.animals["gouda"] > 0) {
                            if (breedingObject[animal]==0 && !this.freeze[animal]) {
                                if ((animal == "chicken" && addons["chicken"]) || animal != "chicken") {
                                    breedingObject[animal]++;
                                    goudaBreed = true;
                                }
                            }
                        }
                    }
                    break;
                case "pond":
                    for (let animal of ["cod", "salmon", "duck", "beaver", "hippocampus"]) {
                        if (!goudaBreed && this.animals["gouda"] > 0) {
                            if (breedingObject[animal]==0) {
                                breedingObject[animal]++;
                                goudaBreed = true;
                            }
                        }
                    }
                    break;
            }
            if (addons["badger"] && badgerTemp) {
                breedingObject[badgerTemp]++;
                badgerTemp = "";
                this.animals["badger"]--;
            }
            let roosterTemp = 0;
            if (addons["chicken"] && this.animals["rooster"] > 0 && breedingObject["chicken"] > 0) {
                roosterTemp = Math.floor(this.animals["chicken"]/3);
            }
            for (let [animal, amount] of Object.entries(breedingObject)) {
                if (amount > 0 && animal != "fox" && animal != "wolf" && animal != "otter") {
                    if (this.animals[animal] != "goat") {
                        breedingObject[animal] += this.animals[animal];
                    } else {
                        breedingObject[animal] = 0;
                    }
                }
                if (animal != "fox" && animal != "wolf" && animal != "otter") {
                    if (Math.floor(breedingObject[animal]/2) > 0) {
                        breedingObject[animal]+=2*this.animals["unicorn"]+2*this.animals["lettuce"]+2*this.animals["brie"];
                        if (playerAmount == 1) breedingObject[animal]+=2*this.animals["bonusTurn"];
                        if (animal == "chicken") breedingObject[animal]+=2*roosterTemp;
                        breedingObject[animal]=Math.max(2, breedingObject[animal]-Math.floor(this.animals["crow"]/4));
                        !breed1 ? breed1 = animal : !breed2 ? breed2 = animal : !breed3 ? breed3 = animal : !breed4 ? breed4 = animal : breed5 = animal;
                    }
                    if (this.animals[animal] != "goat") this.animals[animal]+=Math.floor(breedingObject[animal]/2);
                }
            }
            if (breedType == "farm") {
                this.freeze["chicken"] = false;
                this.freeze["rabbit"] = false;
                this.freeze["sheep"] = false;
                this.freeze["pig"] = false;
                this.freeze["cow"] = false;
            } else if (breedType == "pond") {
                this.freeze["cod"] = false;
                this.freeze["salmon"] = false;
                this.freeze["duck"] = false;
                this.freeze["beaver"] = false;
            }
            if (breedingObject["fox"] > 0) {
                this.foxAttack();
            }
            if (breedingObject["wolf"] > 0) {
                this.wolfAttack();
            }
            if (breedingObject["otter"] > 0) {
                this.otterAttack();
            }
            this.animals["boar"] *= 0;
        }
    }
}
let players = [];
let addons = {
    "stork": false,         // done
    "badger": false,        // done
    "goat": false,          // done
    "cat": false,           // done
    "chicken": false,       // done
    "blackSheep": false,    // done
    "eagle": false,         // done
    "skunk": false,         // done
    "bee": false,           // done
    "pegasus": false,       // done
    "shadowBeast": false,   // done
    "lettuce": false,       // done
    "pond": false,          // done (until i get possessed and add atlantis)
    "alpaca": false,        // done
    "cheese": false,        // done
    "snowFox": false,       // done
    "ufo": false,           // done
}
let bagBought = false;
let loadedAddons = localStorage.getItem("addons");
if (loadedAddons) {
    for (let [addon, value] of Object.entries(JSON.parse(loadedAddons))) {
        if (addons[addon] !== undefined) {
            addons[addon] = value;
        }
    }
}
let turn = 1;
let activity = "breed";
let roll1 = "";
let roll2 = "";
let storkRoll = "";
let badgerOption1 = "";
let badgerOption2 = "";
let badgerOption3 = "";
let badgerOption4 = "";
let badgerTemp = "";
let goatTemp = "";
let bagRoll = "";
let eagleTemp = "";
let skunkRoll = "";
let beeOutput = "";
let isBonusTurn = false;
let doBonusTurn = false;
let temp = null;
let nightOutput = "";
let shadowBeastTemp = "";
let pondRoll1 = "";
let pondRoll2 = "";
let shadowTalismanUsed = false;
let celestialTalismanUsed = false;
let ufoChoice1 = -1;
let ufoChoice2 = -1;
let ufoChoice3 = -1;
let ufoArr = new Set();
let ufoReward = "";

function renderEnd() {
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);
    switch (winner) {
        case "Player 1":
            ctx.fillStyle = "rgb(192, 0, 0)";
            break;
        case "Player 2":
            ctx.fillStyle = "rgb(0, 192, 0)";
            break;
        case "Player 3":
            ctx.fillStyle = "rgb(0, 127, 192)";
            break;
        case "Player 4":
            ctx.fillStyle = "rgb(127, 0, 127)";
            break;
    }
    ctx.font = String(height/10)+"px pixel";
    ctx.fillText(winner+" wins!", width/2-ctx.measureText(winner+" wins!").width/2, height/2);
    textButton("Play again", width/2-ctx.measureText("Play again").width/2, height/2+height/10, "rgb(255, 255, 255)", () => {
        location.reload();
    });
}

function renderBackground() {
    ctx.fillStyle = "rgb(0, 127, 0)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = "1px pixel";
    ctx.font = String(width/ctx.measureText(version).width/20)+"px pixel";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText(version, width-ctx.measureText(version).width, height);
}

function removeListeners() {
    let canvasCopy = canvas.cloneNode(false);
    document.body.replaceChild(canvasCopy, canvas);
    canvas = canvasCopy;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.lineWidth = 2;
}

function image(image, x, y, size) {
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.drawImage(images[image], x, y, size, size);
    ctx.strokeRect(x, y, size, size);
}

function imageButton(image, x, y, width, height, callback, hoverImage) {
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.drawImage(images[image], x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    function hover(e) {
        if (e.clientX > x && e.clientX < x+width && e.clientY > y && e.clientY < y+height) {
            ctx.drawImage(images[image], x, y, width, height);
            if (hoverImage) ctx.drawImage(images[hoverImage], x, y, width, height);
            ctx.strokeStyle = "rgb(255, 255, 0)";
            ctx.strokeRect(x, y, width, height);
            ctx.strokeStyle = "rgb(0, 0, 0)";
        } else {
            ctx.drawImage(images[image], x, y, width, height);
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(x, y, width, height);
        }
    }
    canvas.addEventListener("mousemove", hover);
    function click(e) {
        if (e.clientX > x && e.clientX < x+width && e.clientY > y && e.clientY < y+height) {
            removeListeners();
            callback();
        }
    }
    canvas.addEventListener("click", click);
}

function imageText(image, text, x, y, size, color, frozen) {
    frozen = frozen || false;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.drawImage(images[image], x, y, size, size);
    ctx.strokeRect(x, y, size, size);
    if (frozen) {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(images["freeze"], x, y, size, size);
        ctx.globalAlpha = 1;
    }
    ctx.fillStyle = color;
    ctx.font = String(size/3)+"px pixel";
    let line1 = "";
    let line2 = "";
    let line3 = "";
    for (let i = 0; i < text.length; i++) {
        if (i<3) {
            line1+=text[i];
        } else if (i<6) {
            line2+=text[i];
        } else {
            line3+=text[i];
        }
    }
    ctx.fillText(line1, x, y+size/3);
    ctx.fillText(line2, x, y+size*2/3);
    ctx.fillText(line3, x, y+size);
}

function imageTextButton(image, text, x, y, size, color, callback) {
    imageText(image, text, x, y, size, color);
    function hover(e) {
        if (e.clientX > x && e.clientX < x+size && e.clientY > y && e.clientY < y+size) {
            ctx.strokeStyle = "rgb(255, 255, 0)";
            ctx.strokeRect(x, y, size, size);
            ctx.strokeStyle = "rgb(0, 0, 0)";
        } else {
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(x, y, size, size);
        }
    }
    canvas.addEventListener("mousemove", hover);
    function click(e) {
        if (e.clientX > x && e.clientX < x+size && e.clientY > y && e.clientY < y+size) {
            removeListeners();
            callback();
        }
    }
    canvas.addEventListener("click", click);
}

function textButton(text, x, y, colorBackground, callback, color, colorBorder) {
    let height = ctx.measureText("M").width;
    let width = ctx.measureText(text).width;
    color = color || "rgb(255, 255, 0)";
    colorBorder = colorBorder || "rgb(0, 0, 0)";
    ctx.strokeStyle = colorBorder;
    ctx.strokeText(text, x, y);
    function hover(e) {
        if (e.clientX > x && e.clientX < x+width && e.clientY > y-height && e.clientY < y) {
            ctx.fillStyle = color;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        } else {
            ctx.fillStyle = colorBackground;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
    }
    canvas.addEventListener("mousemove", hover);
    function click(e) {
        if (e.clientX > x && e.clientX < x+width && e.clientY > y-height && e.clientY < y) {
            removeListeners();
            callback();
        }
    }
    canvas.addEventListener("click", click);
}

function charButton(char, x, y, size, background, callback) {
    ctx.fillStyle = background;
    ctx.fillRect(x, y, size, size);
    ctx.font = String(size/2)+"px pixel";
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.strokeRect(x, y, size, size);
    ctx.strokeText(char, x+size/2-ctx.measureText("M").width/2, y+size/2+ctx.measureText("M").width/2);
    function hover(e) {
        if (e.clientX > x && e.clientX < x+size && e.clientY > y && e.clientY < y+size) {
            ctx.fillStyle = "rgb(255, 255, 0)";
            ctx.fillText(char, x+size/2-ctx.measureText("M").width/2, y+size/2+ctx.measureText("M").width/2);
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(x, y, size, size);
            ctx.strokeText(char, x+size/2-ctx.measureText("M").width/2, y+size/2+ctx.measureText("M").width/2);
        } else {
            ctx.fillStyle = background;
            ctx.fillRect(x, y, size, size);
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(x, y, size, size);
            ctx.strokeText(char, x+size/2-ctx.measureText("M").width/2, y+size/2+ctx.measureText("M").width/2);
        }
    }
    canvas.addEventListener("mousemove", hover);
    function click(e) {
        if (e.clientX > x && e.clientX < x+size && e.clientY > y && e.clientY < y+size) {
            removeListeners();
            callback();
        }
    }
    canvas.addEventListener("click", click);
}

function renderLine(text, line, color) {
    let animalAmount = 0;
    for (let [animal, amount] of Object.entries(new Player("temp").animals)) {
        animalAmount++;
    }
    let playerWidth = height*Math.ceil(animalAmount/4)/20;
    ctx.fillStyle = color;
    ctx.fillText(text, width/2+playerWidth/2-ctx.measureText(text).width/2, ctx.measureText("M").width*(line+1));
}

function renderPlayers(players) {
    let playerHeight = height/4;
    let animalAmount = 0;
    for (let [animal, amount] of Object.entries(new Player("temp").animals)) {
        animalAmount++;
    }
    let animalSize = playerHeight/5;
    let playerWidth = animalSize*Math.ceil(animalAmount/4);
    players.forEach((player, index) => {
        switch (index) {
            case 0:
                ctx.fillStyle = "rgb(192, 0, 0)";
                break;
            case 1:
                ctx.fillStyle = "rgb(0, 192, 0)";
                break;
            case 2:
                ctx.fillStyle = "rgb(0, 127, 192)";
                break;
            case 3:
                ctx.fillStyle = "rgb(127, 0, 127)";
                break;
        }
        let playerColor = ctx.fillStyle;
        if (index == turn-1) {
            ctx.fillStyle = "rgb(255, 255, 255)";
        }
        ctx.fillRect(0, playerHeight*index, playerWidth, playerHeight);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.strokeStyle = "rgb(0, 0, 0)";
        if (index == turn-1) {
            ctx.strokeRect(0, playerHeight*index, playerWidth, 0);
            ctx.strokeRect(0, playerHeight*turn, 0, playerHeight);
        } else {
            ctx.strokeRect(0, playerHeight*index, playerWidth, playerHeight);
        }
        ctx.font = String(animalSize/2)+"px pixel";
        if (index == turn-1) {
            ctx.fillStyle = playerColor;
        }
        ctx.fillText(player.name, ctx.measureText("M").width*0.5, index != turn-1 ? playerHeight*index+ctx.measureText("M").width*1.5 : playerHeight*index+ctx.measureText("M").width*5);
        ctx.fillStyle = "rgb(0, 0, 0)";
        let indexX = 0;
        let indexY = 1;
        for (let [animal, amount] of Object.entries(player.animals)) {
            let quantifier = true;
            if (Object.keys(addons).includes(animal)) {
                quantifier = addons[animal];
            } else if (animal == "rooster" || animal == "wood" || animal == "coop") {
                quantifier = addons["chicken"];
            } else if (animal == "boar" || animal == "owl") {
                quantifier = addons["skunk"];
            } else if (animal == "honey" || animal == "bonusTurn") {
                quantifier = addons["bee"];
            } else if (animal == "donkey" || animal == "squirrel") {
                quantifier = addons["pegasus"];
            } else if (animal == "unicorn" || animal == "nightmare" || animal == "celestialTalisman" || animal == "shadowTalisman") {
                quantifier = addons["shadowBeast"];
            } else if (["cod","salmon","duck","beaver","hippocampus","turtle","frog"].includes(animal)) {
                quantifier = addons["pond"];
            } else if (["water", "stick", "hay", "pumpkin", "scarecrow", "crow"].includes(animal)) {
                quantifier = addons["lettuce"];
            } else if ([ "milk", "mouse", "cheddar", "brie", "gouda", "blueCheese" ].includes(animal)) {
                quantifier = addons["cheese"];
            } else if (animal == "phoenix") {
                quantifier = addons["snowFox"];
            }
            if (quantifier && turn != index+1) {
                let text = String(amount);
                while (text.length < 3) text+=" ";
                let color;
                if (amount > player.animalCap[animal] && player.animalCap[animal] != -1) {
                    color = "rgb(255, 0, 0)";
                } else {
                    color = "rgb(0, 0, 0)";
                }
                if (player.animalCap[animal] != -1) text+="/"+String(player.animalCap[animal]);
                if (amount == "goat") text = "go at";
                if (animal == "bee") text = "lv"+String(amount);
                imageText(amount == "goat" ? "goat" : animal, text, animalSize*indexX, playerHeight*index+animalSize*indexY, animalSize, color, player.freeze[animal]);
                indexX++;
                if (indexX == Math.ceil(animalAmount/4)) {
                    indexX = 0;
                    indexY++;
                }
            }
        }
    });
}

function renderPlayArea() {
    ctx.font = String(height/60)+"px pixel";
    let animalAmount = 0;
    for (let [animal, amount] of Object.entries(new Player("temp").animals)) {
        animalAmount++;
    }
    let playerWidth = height*Math.ceil(animalAmount/4)/20;
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.fillRect(playerWidth, 0, width-playerWidth, height);
    ctx.strokeRect(0, 0, width, height);
    ctx.strokeRect(playerWidth, 0, 0, height/4*(turn-1));
    ctx.strokeRect(playerWidth, height/4*turn, 0, height/4*(4-turn));
    ctx.strokeRect(0, height/4*playerAmount, playerWidth, height/4*(4-playerAmount));
    let color = "rgb(0, 0, 0)";
    switch (turn) {
        case 1:
            color = "rgb(192, 0, 0)";
            break;
        case 2:
            color = "rgb(0, 192, 0)";
            break;
        case 3:
            color = "rgb(0, 127, 192)";
            break;
        case 4:
            color = "rgb(127, 0, 127)";
            break;
    }
    if (turn) {
        renderLine("Player "+turn+"'s turn:", 0, color);
        let player = players[turn-1];
        let animalSize = height/15;
        let animalsInRow = Math.floor((width-playerWidth)/animalSize);
        let rowAmount = Math.ceil(animalAmount/animalsInRow);
        let margin = (width-playerWidth-animalsInRow*animalSize)/2;
        let indexX = 0;
        let indexY = 0;
        let font = ctx.font;
        ctx.font = String(animalSize/5)+"px pixel";
        for (let [animal, amount] of Object.entries(player.animals)) {
            let quantifier = true;
            if (Object.keys(addons).includes(animal)) {
                quantifier = addons[animal];
            } else if (animal == "rooster" || animal == "wood" || animal == "coop") {
                quantifier = addons["chicken"];
            } else if (animal == "boar" || animal == "owl") {
                quantifier = addons["skunk"];
            } else if (animal == "honey" || animal == "bonusTurn") {
                quantifier = addons["bee"];
            } else if (animal == "donkey" || animal == "squirrel") {
                quantifier = addons["pegasus"];
            } else if (animal == "unicorn" || animal == "nightmare" || animal == "celestialTalisman" || animal == "shadowTalisman") {
                quantifier = addons["shadowBeast"];
            } else if (["cod","salmon","duck","beaver","hippocampus","turtle","frog"].includes(animal)) {
                quantifier = addons["pond"];
            } else if (["water", "stick", "hay", "pumpkin", "scarecrow", "crow"].includes(animal)) {
                quantifier = addons["lettuce"];
            } else if ([ "milk", "mouse", "cheddar", "brie", "gouda", "blueCheese" ].includes(animal)) {
                quantifier = addons["cheese"];
            } else if (animal == "phoenix") {
                quantifier = addons["snowFox"];
            }
            if (quantifier) {
                image(animal == "goat" ? "goat" : animal, playerWidth+margin+indexX*animalSize, height-rowAmount*(animalSize)-margin+indexY*animalSize, animalSize);
                ctx.fillStyle = "rgb(0, 0, 0)";
                let cap = player.animalCap[animal];
                let text = String(amount);
                if (cap != -1 && amount != "goat") text+="/"+String(cap);
                if (cap != -1 && amount > cap && amount != "goat") ctx.fillStyle = "rgb(255, 0, 0)";
                if (amount == "goat") text = "goat";
                if (animal == "bee") text = "lv"+String(amount);
                if (player.freeze[animal]) {
                    ctx.globalAlpha = 0.4;
                    ctx.drawImage(images["freeze"], playerWidth+margin+indexX*animalSize, height-rowAmount*(animalSize)-margin+indexY*animalSize, animalSize, animalSize);
                    ctx.globalAlpha = 1;
                }
                ctx.fillText(text, playerWidth+margin+indexX*animalSize, height-rowAmount*(animalSize)-margin+indexY*animalSize+ctx.measureText("M").width);
                indexX++;
                if (indexX == animalsInRow) {
                    indexX = 0;
                    indexY++;
                }
            }
        }
        ctx.font = font;
    }
}

function colorButton(color, x, y, width, height, callback) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    function hover(e) {
        if (e.clientX > x && e.clientX < x+width && e.clientY > y && e.clientY < y+height) {
            ctx.strokeStyle = "rgb(255, 255, 0)";
            ctx.strokeRect(x, y, width, height);
            ctx.strokeStyle = "rgb(0, 0, 0)";
        } else {
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(x, y, width, height);
        }
    }
    canvas.addEventListener("mousemove", hover);
    function click(e) {
        if (e.clientX > x && e.clientX < x+width && e.clientY > y && e.clientY < y+height) {
            removeListeners();
            callback();
        }
    }
    canvas.addEventListener("click", click);
}

function nextTurn() {
    bagBought = false;
    if (doBonusTurn) {
        players[turn-1].animals["bonusTurn"]--;
        doBonusTurn = false;
        isBonusTurn = true;
    } else {
        turn++;
        isBonusTurn = false;
    }
    shadowTalismanUsed = false;
    celestialTalismanUsed = false;
    addons["skunk"] ? activity = "skunk" : activity = "breed";
    if (turn > playerAmount) {
        turn = 1;
        if (addons["stork"] || addons["lettuce"]) {
            activity = "global";
        }
    }
    while (players[turn-1].animals["blueCheese"] > 0 && turn <= playerAmount && playerAmount > 1) {
        players[turn-1].animals["blueCheese"]--;
        turn++;
        if (turn > playerAmount) {
            turn = 1;
            if (addons["stork"] || addons["lettuce"]) {
                activity = "global";
            }
            break;
        }
    }
    if (addons["pegasus"] && players[turn-1].animals["donkey"] == 0) players[turn-1].animals["squirrel"]++;
    if (addons["lettuce"] && players[turn-1].animals["scarecrow"] == 0) players[turn-1].animals["crow"]++;
    if (addons["cheese"] && players[turn-1].animals["cow"] != "goat") players[turn-1].animals["milk"]+=Math.min(4, players[turn-1].animals["cow"]);
    if (players[turn-1].animals["coop"] == 1) {
        die1 = ["rabbit","rabbit","rabbit","rabbit","rabbit","rabbit",
            "sheep","sheep","sheep","pig","horse","wolf"];
        die2 = ["rabbit","rabbit","rabbit","rabbit","rabbit","rabbit",
            "sheep","sheep","pig","pig","cow","fox"];
    } else if (addons["chicken"]) {
        die1 = ["chicken","chicken","chicken","chicken","rabbit","rabbit",
                "rabbit","sheep","sheep","pig","horse","wolf"];
        die2 = ["chicken","chicken","chicken","chicken","rabbit","rabbit",
                "sheep","sheep","pig","pig","cow","fox"];
    }
    players[turn-1].prune();
    if (activity == "global") turn = 0;
    renderBackground();
    renderGame();
}

function clearAll() {
    removeListeners();
    renderBackground();
    renderPlayers(players);
    renderPlayArea();
}

let shop = [];
let shopPage = 1;
let shopPages = 0;
let prevShopPages = 0;
let shopPageArr = [];

function renderGame() {
    if (turn) players[turn-1].setCaps();
    removeListeners();
    renderBackground();
    renderPlayers(players);
    renderPlayArea();
    let animalAmount = 0;
    for (let [animal, amount] of Object.entries(new Player("temp").animals)) {
        animalAmount++;
    }
    let playerWidth = height*Math.ceil(animalAmount/4)/20;
    ctx.font = String(height/60)+"px pixel";
    let buttonSize = ctx.measureText("M").width*4;
    let text = "";
    let startX;
    let startY, indexX, indexY;
    let playerList;
    let animalList;
    switch (activity) {
        case "skunk":
            renderLine("Let's see what the morning brings:", 1, "rgb(0, 0, 0)");
            imageButton("empty", width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                skunkRoll = skunkDie[Math.floor(Math.random()*skunkDie.length)];
                activity = "skunkRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        skunkRoll = skunkDie[Math.floor(Math.random()*skunkDie.length)];
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = "skunkResult"
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            });
            break;
        case "skunkRoll":
            renderLine("Let's see what the morning brings:", 1, "rgb(0, 0, 0)");
            image(skunkRoll, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize);
            break;
        case "skunkResult":
            switch (skunkRoll) {
                case "skunk":
                    text = players[turn-1].animals["owl"] > 0 ? "You lose your owl!" : playerAmount > 1 ? "You lose a turn!" : "Your animals run away, repulsed by the smell!";
                    break;
                case "snake":
                    text = "You lose a rabbit!";
                    break;
                case "empty":
                    text = "Nothing happens.";
                    break;
                case "rabbit":
                    text = "You gain a rabbit!";
                    break;
                case "boar":
                    text = "A boar will join your farm for a turn!";
                    break;
                case "owl":
                    text = players[turn-1].animals["owl"] > 0 ? "You already have an owl!" : "An owl will join your farm for a small payment!";
                    break;
            }
            renderLine(text, 1, "rgb(0, 0, 0)");
            imageButton(skunkRoll, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                activity = "breed";
                switch (skunkRoll) {
                    case "skunk":
                        if (players[turn-1].animals["owl"] > 0) {
                            players[turn-1].animals["owl"]--;
                            renderBackground();
                            renderGame();
                        } else if (playerAmount > 1) {
                            activity = "skunk";
                            nextTurn();
                        } else {
                            for (let animal of ["chicken", "rabbit", "sheep", "pig"]) {
                                players[turn-1].animals[animal] = Math.max(0, Math.sign(players[turn-1].animals[animal]));
                            }
                            renderBackground();
                            renderGame();
                        }
                        break;
                    case "snake":
                        players[turn-1].animals["rabbit"]-=Math.min(1, players[turn-1].animals["rabbit"]);
                        renderBackground();
                        renderGame();
                        break;
                    case "empty":
                        renderBackground();
                        renderGame();
                        break;
                    case "rabbit":
                        players[turn-1].animals["rabbit"]++;
                        renderBackground();
                        renderGame();
                        break;
                    case "boar":
                        players[turn-1].animals["boar"]++;
                        renderBackground();
                        renderGame();
                        break;
                    case "owl":
                        if (players[turn-1].animals["owl"] > 0) {
                            renderBackground();
                            renderGame();
                        } else {
                            activity = "owl";
                            renderBackground();
                            renderGame();
                        }
                        break;
                }
            })
            break;
        case "owl":
            renderLine("Feed the owl 4 rabbits?", 1, "rgb(0, 0, 0)");
            imageTextButton("rabbit","  0" , width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize, "rgb(0, 0, 0)", () => {
                activity = "breed";
                    renderBackground();
                    renderGame();
            });
            if (players[turn-1].animals["rabbit"] >= 4) {
                imageTextButton("rabbit", "  4", width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize, "rgb(0, 0, 0)", () => {
                    players[turn-1].animals["rabbit"]-=4;
                    players[turn-1].animals["owl"]++;
                    activity = "breed";
                    renderBackground();
                    renderGame();
                });
            } else {
                imageText("rabbit", "  4", width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize, "rgb(255, 0, 0)");
            }
            break;
        case "breed":
            renderLine("Roll the dice!", 1, "rgb(0, 0, 0)");
            imageButton("empty", width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize, buttonSize, () => {
                clearAll();
                roll1 = die1[Math.floor(Math.random()*die1.length)];
                activity = "breedRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        roll1 = die1[Math.floor(Math.random()*die1.length)];
                        roll2 = die2[Math.floor(Math.random()*die2.length)];
                        if (players[turn-1].animals["shadowTalisman"] > 0) {
                            roll1 = die1.at(Math.floor(Math.min(Math.random()*die1.length, Math.random()*die1.length))-1);
                            roll2 = die2.at(Math.floor(Math.min(Math.random()*die2.length, Math.random()*die2.length))-1);
                        }
                        if (players[turn-1].animals["celestialTalisman"] > 0) {
                            roll1 = die1.at(Math.floor(Math.max(Math.random()*die1.length, Math.random()*die1.length))-1);
                            roll2 = die2.at(Math.floor(Math.max(Math.random()*die2.length, Math.random()*die2.length))-1);
                        }
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = (addons["badger"] && players[turn-1].animals["badger"] > 0) ? "badger" : "breedResult";
                            if (addons["alpaca"] && players[turn-1].animals["alpaca"] > 0) activity = "alpaca";
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            });
            imageButton("empty", width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                clearAll();
                roll1 = die1[Math.floor(Math.random()*die1.length)];
                activity = "breedRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        roll1 = die1[Math.floor(Math.random()*die1.length)];
                        roll2 = die2[Math.floor(Math.random()*die2.length)];
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = (addons["badger"] && players[turn-1].animals["badger"] > 0) ? "badger" : "breedResult";
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            });
            break;
        case "breedRoll":
            image(roll1, width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize);
            image(roll2, width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize);
            break;
        case "alpaca":
            renderLine("Reroll?", 1, "rgb(0, 0, 0)");
            imageButton(roll1, width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize, buttonSize, () => {
                clearAll();
                roll1 = die1[Math.floor(Math.random()*die1.length)];
                activity = "breedRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        roll1 = die1[Math.floor(Math.random()*die1.length)];
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = (addons["badger"] && players[turn-1].animals["badger"] > 0) ? "badger" : "breedResult";
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            });
            imageButton(roll2, width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                clearAll();
                roll2 = die2[Math.floor(Math.random()*die2.length)];
                activity = "breedRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        roll2 = die2[Math.floor(Math.random()*die2.length)];
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = (addons["badger"] && players[turn-1].animals["badger"] > 0) ? "badger" : "breedResult";
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            });
            imageTextButton("empty", "  X", width/2+playerWidth/2+buttonSize*5/2, buttonSize, buttonSize, "rgb(255, 0, 0)", () => {
                activity = (addons["badger"] && players[turn-1].animals["badger"] > 0) ? "badger" : "breedResult";
                renderBackground();
                renderGame();
            });
            break;
        case "badger":
            text = "You got a "+roll1+" and a "+roll2+"!";
            if (addons["snowFox"]) {
                text = text.replace("fox", "snow fox");
                text = text.replace("wolf", "ice wolf");
            }
            renderLine(text, 1, "rgb(0, 0, 0)");
            badgerOption1 = "";
            badgerOption2 = "";
            badgerOption3 = "";
            badgerOption4 = "";
            badgerTemp = "";
            image(roll1, width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize);
            image(roll2, width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize);
            animalList = [];
            if (roll1 != "wolf") {
                players[turn-1].freeze[roll1] || animalList.push(roll1);
            }
            if (roll2 != "fox" && !animalList.includes(roll2)) {
                players[turn-1].freeze[roll2] || animalList.push(roll2);
            }
            if (players[turn-1].animals["boar"] > 0 && !animalList.includes("pig")) {
                players[turn-1].freeze["pig"] || animalList.push("pig");
            }
            temp = true;
            for (let animal of ["chicken", "rabbit", "sheep", "pig", "cow", "horse"]) {
                if (temp && players[turn-1].animals["gouda"] > 0) {
                    if (!animalList.includes(animal) && !players[turn-1].freeze[animal]) {
                        if ((animal == "chicken" && addons["chicken"] && players[turn-1].animals["coop"] == 0) || animal != "chicken") {
                            animalList.push(animal);
                            temp = false;
                        }
                    }
                }
            }
            if (players[turn-1].animals["coop"] > 0) players[turn-1].freeze["chicken"] || animalList.push("chicken");
            if (animalList.length == 0) {
                activity = "breedResult";
                renderBackground();
                renderGame();
            }
            animalList.push("empty");
            animalList.forEach((animal, index) => {
                if (animal != "empty") {
                    if (players[turn-1].animals[animal] == "goat" || players[turn-1].freeze[animal]) {
                        animalList.splice(index, 1);
                    }
                }
            });
            renderLine("What will the badger breed as?", 9, "rgb(0, 0, 0)");
            startX = width/2+playerWidth/2+buttonSize/2-buttonSize*animalList.length;
            startY = buttonSize*3;
            animalList.forEach((animal, index) => {
                imageButton(animal, startX+buttonSize*index*2, startY, buttonSize, buttonSize, () => {
                    badgerTemp = animal == "empty" ? "" : animal;
                    activity = "breedResult";
                    renderBackground();
                    renderGame();
                });
            });
            break;
        case "breedResult":
            text = "You got a "+roll1+" and a "+roll2+"!";
            if (addons["snowFox"]) {
                text = text.replace("fox", "snow fox");
                text = text.replace("wolf", "ice wolf");
            }
            renderLine(text, 1, "rgb(0, 0, 0)");
            image(roll1, width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize);
            image(roll2, width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize);
            if (badgerTemp != "") {
                renderLine("The badger will breed as a "+badgerTemp+"!", 2, "rgb(0, 0, 0)");
            }
            textButton("Continue", width/2+playerWidth/2-ctx.measureText("Continue").width/2, buttonSize*3, "rgb(255, 255, 255)", () => {
                activity = addons["bee"] ? players[turn-1].animals["bee"] > 0 ? "bee" : "bear" : "shop";
                players[turn-1].breed(roll1, roll2);
                players[turn-1].prune();
                players[turn-1].animals["lettuce"] *= 0;
                players[turn-1].animals["brie"] *= 0;
                players[turn-1].animals["gouda"] *= 0;
                if (playerAmount == 1) players[turn-1].animals["bonusTurn"] *= 0;
                renderBackground();
                renderGame();
            });
            break;
        case "bee":
            beeOutput = "";
            renderLine("Check if you got any honey!", 1, "rgb(0, 0, 0)");
            imageButton("empty", width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                clearAll();
                beeOutput = die1[Math.floor(Math.random()*die1.length)];
                activity = "beeRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        beeOutput = players[turn-1].honeyDie[Math.floor(Math.random()*players[turn-1].honeyDie.length)];
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = "beeResult";
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            });
            break;
        case "beeRoll":
            renderLine("Check if you got any honey!", 1, "rgb(0, 0, 0)");
            image(beeOutput, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize);
            break;
        case "beeResult":
            text = "";
            if (isBonusTurn) {
                beeOutput = "honey";
            }
            switch (beeOutput) {
                case "empty":
                    text = "You got no honey.";
                    break;
                case "honey":
                    text = "You got 1 honey!";
                    break;
                case "bonusTurn":
                    text = playerAmount == 1 ? "You will get a higher breeding yield!" : "You got a bonus turn!";
                    break;
            }
            renderLine(text, 1, "rgb(0, 0, 0)");
            imageButton(beeOutput, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                activity = "bear";
                switch (beeOutput) {
                    case "empty":
                        break;
                    case "honey":
                        players[turn-1].animals["honey"]++;
                        players[turn-1].prune();
                        break;
                    case "bonusTurn":
                        if (playerAmount != 1) {
                            doBonusTurn = true;
                        }
                        players[turn-1].animals["bonusTurn"]++;
                        break;
                }
                renderBackground();
                renderGame();
            });
            break;
        case "bear":
            if (temp === null) {
                temp = Math.floor(Math.random()*10);
            }
            let bearCheck = false;
            for ( animal of ["horse", "cow", "pig", "sheep", "rabbit", "chicken"] ) {
                if (players[turn-1].animals[animal] > 0 && !bearCheck) {
                    bearCheck = animal;
                }
            }
            if (!bearCheck || temp !== 0) {
                activity = "shop";
                temp = null;
                renderBackground();
                renderGame();
            } else {
                renderLine("A hungry bear approaches your farm!", 1, "rgb(0, 0, 0)");
                imageTextButton(bearCheck, "  1", width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize, "rgb(0, 0, 0)", () => {
                    activity = "shop";
                    players[turn-1].animals[bearCheck]--;
                    renderBackground();
                    renderGame();
                });
                if (players[turn-1].animals["honey"] >= 3) {
                    imageTextButton("honey", "  3", width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize, "rgb(0, 0, 0)", () => {
                        activity = "shop";
                        players[turn-1].animals["honey"]-=3;
                        renderBackground();
                        renderGame();
                    });
                } else {
                    imageText("honey", "  3", width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize, "rgb(255, 0, 0)");
                }
            }
            break;
        case "shop":
            renderLine("Buy animals!", 1, "rgb(0, 0, 0)");
            shop = [];
            if (addons["chicken"]) shop.push([["chicken", 4], ["rabbit", 1], "twoSided"]);
            shop.push([["rabbit", 6], ["sheep", 1], "twoSided"])
            if (players[turn-1].animals["pig"] == "goat" && players[turn-1].animals["cow"] == "goat" && players[turn-1].animals["horse"] == "goat") {
                if (players[turn-1].animals["smallDog"] < 2) shop.push([["sheep", 1], ["smallDog", 1], "leftToRight"]);
                if (players[turn-1].animals["bigDog"] < 2) shop.push([["sheep", 6], ["bigDog", 1], "leftToRight"]);
            } else if (players[turn-1].animals["cow"] == "goat" && players[turn-1].animals["horse"] == "goat") {
                shop.push([["sheep", 2], ["pig", 1], "twoSided"]);
                if (players[turn-1].animals["smallDog"] < 2) shop.push([["sheep", 1], ["smallDog", 1], "leftToRight"]);
                if (players[turn-1].animals["bigDog"] < 2) shop.push([["pig", 3], ["bigDog", 1], "leftToRight"]);
            } else if (players[turn-1].animals["pig"] == "goat") {
                shop.push([["sheep", 6], ["cow", 1], "twoSided"]);
                shop.push([["cow", 2], ["horse", 1], "twoSided"]);
                if (addons["pegasus"]) shop.push([["horse", 2], ["pegasus", 1], "twoSided"]);
                if (players[turn-1].animals["smallDog"] < 2) shop.push([["sheep", 1], ["smallDog", 1], "leftToRight"]);
                if (players[turn-1].animals["bigDog"] < 2) shop.push([["cow", 1], ["bigDog", 1], "leftToRight"]);
            } else if (players[turn-1].animals["cow"] == "goat") {
                shop.push([["sheep", 2], ["pig", 1], "twoSided"]);
                shop.push([["pig", 6], ["horse", 1], "twoSided"]);
                if (addons["pegasus"]) shop.push([["horse", 2], ["pegasus", 1], "twoSided"]);
                if (players[turn-1].animals["smallDog"] < 2) shop.push([["sheep", 1], ["smallDog", 1], "leftToRight"]);
                if (players[turn-1].animals["bigDog"] < 2) shop.push([["pig", 3], ["bigDog", 1], "leftToRight"]);
            } else if (players[turn-1].animals["horse"] == "goat") {
                shop.push([["sheep", 2], ["pig", 1], "twoSided"]);
                shop.push([["pig", 3], ["cow", 1], "twoSided"]);
                if (players[turn-1].animals["smallDog"] < 2) shop.push([["sheep", 1], ["smallDog", 1], "leftToRight"]);
                if (players[turn-1].animals["bigDog"] < 2) shop.push([["cow", 1], ["bigDog", 1], "leftToRight"]);
            } else {
                shop.push([["sheep", 2], ["pig", 1], "twoSided"]);
                shop.push([["pig", 3], ["cow", 1], "twoSided"]);
                shop.push([["cow", 2], ["horse", 1], "twoSided"]);
                if (addons["pegasus"]) shop.push([["horse", 2], ["pegasus", 1], "twoSided"]);
                if (players[turn-1].animals["smallDog"] < 2) shop.push([["sheep", 1], ["smallDog", 1], "leftToRight"]);
                if (players[turn-1].animals["bigDog"] < 2) shop.push([["cow", 1], ["bigDog", 1], "leftToRight"]);
            }
            if (addons["chicken"] && players[turn-1].animals["rooster"] == 0) {
                shop.push([["rabbit", 1], ["rooster", 1], "leftToRight"]);
            }
            if (addons["pegasus"]) {
                if (players[turn-1].animals["donkey"] == 0) {
                    shop.push([["cow", 1], ["donkey", 1], "leftToRight"]);
                }
                if (players[turn-1].animals["squirrel"] > 0) {
                    shop.push([["rabbit", 1], ["squirrel", Math.max(-4, players[turn-1].animals["squirrel"]*-1)], "leftToRight"]);
                }
            }
            if (addons["stork"] && players[turn-1].animals["stork"] >= 2) {
                if (breed1) shop.push([["stork", 2], [breed1, 1], "leftToRight"]);
                if (breed2) shop.push([["stork", 2], [breed2, 1], "leftToRight"]);
                if (breed3) shop.push([["stork", 2], [breed3, 1], "leftToRight"]);
                if (breed4) shop.push([["stork", 2], [breed4, 1], "leftToRight"]);
                if (breed5) shop.push([["stork", 2], [breed5, 1], "leftToRight"]);
            }
            if (addons["blackSheep"]) {
                if (players[turn-1].animals["blackSheep"] > 0) {
                    shop.push([["blackSheep", 1], ["sheep", 1], "leftToRight"]);
                } else {
                    shop.push([["sheep", 1], ["blackSheep", 1], "leftToRight"]);
                }
            }
            if (addons["bee"] && players[turn-1].animals["bee"] < 5) {
                let price;
                if (players[turn-1].animals["bee"] == 0) {
                    price = ["rabbit", 2];
                } else if (players[turn-1].animals["bee"] < 4) {
                    price = ["honey", players[turn-1].animals["bee"]];
                } else {
                    price = ["honey", 5];
                }
                shop.push([price, ["bee", "+"], "leftToRight"]);
            }
            if (addons["bee"] && players[turn-1].animals["bee"] > 0) {
                shop.push([["honey", 2], ["rabbit", 1], "leftToRight"]);
            }
            if (addons["lettuce"] && players[turn-1].animals["lettuce"] == 0 && players[turn-1].animals["water"] >= 2) {
                shop.push([["water", 2], ["lettuce", 1], "leftToRight"]);
            }
            if (players[turn-1].animals["crow"] > 0) {
                shop.push([["water", 1], ["crow", Math.max(-4, players[turn-1].animals["crow"]*-1)], "leftToRight"]);
            }
            if (addons["eagle"] && !bagBought) {
                shop.push([["sheep", 1], ["bag", 1], "leftToRight"]);
            }
            if (addons["cat"]) {
                playerList = [];
                players.forEach((player, index) => {
                    if (index+1 != turn) {
                        if (player.animals["smallDog"] > 0 || player.animals["bigDog"] > 0) {
                            playerList.push(index);
                        }
                    }
                })
                if (playerList.length > 0) {
                    shop.push([["pig", 1], ["cat", 1], "leftToRight"]);
                }
            }
            if (addons["goat"]) {
                playerList = [];
                players.forEach((player, index) => {
                    if (index+1 != turn) {
                        if (player.animals["pig"] == 0 || player.animals["cow"] == 0 || player.animals["horse"] == 0) {
                            if (!(player.animals["pig"] == "goat" || player.animals["cow"] == "goat" || player.animals["horse"] == "goat")) {
                                playerList.push(index);
                            }
                        }
                    }
                })
                if (playerList.length > 0 && playerAmount > 1) {
                    shop.push([["sheep", 1], ["goat", 1], "leftToRight"]);
                }
                if (players[turn-1].animals["pig"] == "goat" || players[turn-1].animals["cow"] == "goat" || players[turn-1].animals["horse"] == "goat") {
                    shop.push([["sheep", 3], ["goat", "X"], "leftToRight"]);
                }
            }
            if (addons["pond"]) {
                if (players[turn-1].animals["pond"] == 0) {
                    shop.push([["sheep", 1], ["pond", 1], "leftToRight"]);
                } else {
                    if (players[turn-1].animals["cod"] == 0) shop.push([["rabbit", 1], ["cod", 1], "leftToRight"]);
                    shop.push([["cod", 4], ["salmon", 1], "twoSided"]);
                    shop.push([["salmon", 3], ["duck", 1], "twoSided"]);
                    shop.push([["duck", 3], ["beaver", 1], "twoSided"]);
                    shop.push([["beaver", 4], ["hippocampus", 1], "twoSided"]);
                    if (players[turn-1].animals["hippocampus"] > 0) {
                        shop.push([["hippocampus", 1], ["cow", 1], "leftToRight"])
                    } else if (players[turn-1].animals["beaver"] > 0) {
                        shop.push([["beaver", 1], ["sheep", 1], "leftToRight"])
                    } else if (players[turn-1].animals["duck"] > 0) {
                        shop.push([["duck", 1], ["rabbit", 1], "leftToRight"])
                    }
                    if (players[turn-1].animals["turtle"] < 2) shop.push([["salmon", 3], ["turtle", 1], "leftToRight"]);
                }
            }
            if (addons["alpaca"] && players[turn-1].animals["alpaca"] == 0) {
                shop.push([["cow", 1], ["alpaca", 1], "leftToRight"]);
            }
            if (addons["shadowBeast"] && players[turn-1].animals["shadowTalisman"] > 0 && !shadowTalismanUsed && playerAmount > 1) {
                shop.push([["shadowTalisman", 0], ["snake", 1], "leftToRight"]);
                shop.push([["smallDog", 1], ["fox", 1], "leftToRight"]);
                shop.push([["bigDog", 1], ["wolf", 1], "leftToRight"]);
                if (addons["pond"] && players[turn-1].animals["pond"] > 0) shop.push([["turtle", 1], ["otter", 1], "leftToRight"]);
            }
            if (addons["shadowBeast"] && players[turn-1].animals["celestialTalisman"] > 0 && !celestialTalismanUsed && playerAmount > 1) {
                shop.push([["celestialTalisman", 0], ["rabbit", 1], "leftToRight"]);
                if (players[turn-1].animals["smallDog"] < 2) shop.push([["celestialTalisman", 0], ["smallDog", 1], "leftToRight"]);
                if (players[turn-1].animals["bigDog"] < 2) shop.push([["celestialTalisman", 0], ["bigDog", 1], "leftToRight"]);
                if (addons["pond"] && players[turn-1].animals["pond"] > 0 && players[turn-1].animals["turtle"] < 2) shop.push([["celestialTalisman", 0], ["turtle", 1], "leftToRight"]);
            }
            if (addons["cheese"]) {
                if (players[turn-1].animalCap["milk"]+players[turn-1].animals["cheese"] < 8) shop.push([["milk", players[turn-1].animalCap["milk"]+players[turn-1].animals["cheese"]], ["cheese", 1], "leftToRight"]);
                if (players[turn-1].animals["cheese"] > 0) shop.push([["cheese", 1], ["mouse", 1], "leftToRight"]);
                if (players[turn-1].animalCap["milk"] >= 5) shop.push([["milk", 5], ["cheddar", 1], "leftToRight"]);
                if (players[turn-1].animals["cheddar"] > 0) shop.push([["cheddar", 1], ["sheep", 1], "leftToRight"]);
                if (players[turn-1].animalCap["milk"] >= 6) shop.push([["milk", 6], ["brie", 1], "leftToRight"]);
                playerList = [];
                players.forEach((player, index) => {
                    if (index+1 != turn) {
                        if (player.animals["blueCheese"] == 0) {
                            playerList.push(index);
                        }
                    }
                });
                if (players[turn-1].animalCap["milk"] >= 7 && (playerList.length != 0 || playerAmount == 1) && players[turn-1].animals["blueCheese"] == 0) shop.push([["milk", 7], ["blueCheese", 1], "leftToRight"]);
                if (players[turn-1].animalCap["milk"] >= 8) shop.push([["milk", 8], ["gouda", 1], "leftToRight"]);
            }
            if (addons["snowFox"] && players[turn-1].animals["phoenix"] < 4) {
                shop.push([["sheep", 1], ["phoenix", 1], "leftToRight"]);
            }
            prevShopPages = shopPages;
            shopPages = Math.ceil(shop.length/18);
            shopPageArr = [];
            for (let i = 0; i < 18; i++) {
                let tradeIndex = (shopPage-1)*18+i;
                if (tradeIndex < shop.length) {
                    shopPageArr.push(shop[tradeIndex]);
                }
            }
            shop = shopPageArr;
            let craftingRecipes = 0;
            let craftingArray = [];
            if (addons["lettuce"] && players[turn-1].animals["scarecrow"] == 0) {
                craftingRecipes++
                craftingArray.push(["crafting", ["","pumpkin",""], ["stick","hay","stick"], ["","stick",""], "scarecrow", ["water", 1, "stick"], ["water", 3, "hay"], ["water", 4, "pumpkin"]]);
            }
            if (addons["chicken"] && players[turn-1].animals["coop"] == 0) {
                craftingRecipes++
                craftingArray.push(["crafting", ["wood","wood","wood"], ["wood","rooster","wood"], ["wood","","wood"], "coop", [addons["pond"] ? "beaver" : "pig", 1, "wood"]]);
            }
            if (shopPage > shopPages) {
                shop = craftingArray[shopPage-shopPages-1];
            }
            if (shopPage > shopPages+craftingRecipes) {
                shopPage = shopPages+craftingRecipes;
            }
            if (shopPage > 1) {
                imageButton("arrowFlip", playerWidth, 0, buttonSize, buttonSize, () => {
                    shopPage--;
                    renderBackground();
                    renderGame();
                }, "arrowHoverFlip");
            } else {
                image("arrowNoFlip", playerWidth, 0, buttonSize);
            }
            if (shopPage < shopPages+craftingRecipes) {
                imageButton("arrow", playerWidth+buttonSize, 0, buttonSize, buttonSize, () => {
                    shopPage++;
                    renderBackground();
                    renderGame();
                }, "arrowHover");
            } else {
                image("arrowNo", playerWidth+buttonSize, 0, buttonSize);
            }
            indexX = 0;
            indexY = 0;
            startX = width/2+playerWidth/2-buttonSize*7;
            startY = buttonSize;
            {
            if (shop[0] == "crafting") {
                let line1 = shop[1];
                let line2 = shop[2];
                let line3 = shop[3];
                let result = shop[4];
                let ingredients = [...line1, ...line2, ...line3];
                let ingredientAmounts = {};
                let playerIngredients = {};
                ingredients.forEach((ingredient) => {
                    if (ingredient != "") {
                        if (ingredientAmounts[ingredient]) {
                            ingredientAmounts[ingredient]++;
                        } else {
                            ingredientAmounts[ingredient] = 1;
                        }
                    }
                });
                Object.keys(ingredientAmounts).forEach((ingredient) => {
                    playerIngredients[ingredient] = players[turn-1].animals[ingredient];
                });
                let canCraft = true;
                Object.keys(ingredientAmounts).forEach((ingredient) => {
                    if (playerIngredients[ingredient] < ingredientAmounts[ingredient]) {
                        canCraft = false;
                    }
                });
                line1.forEach((ingredient, index) => {
                    if (ingredient == "") {
                        image("empty", width/2+playerWidth/2-2.5*buttonSize+index*buttonSize, startY, buttonSize);
                    } else {
                        imageText(ingredient, playerIngredients[ingredient] > 0 ? "  V" : "  X", width/2+playerWidth/2-2.5*buttonSize+index*buttonSize, startY, buttonSize, playerIngredients[ingredient] > 0 ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)");
                        if (playerIngredients[ingredient] > 0) {
                            playerIngredients[ingredient]--;
                            ingredientAmounts[ingredient]--;
                        }
                    }
                });
                line2.forEach((ingredient, index) => {
                    if (ingredient == "") {
                        image("empty", width/2+playerWidth/2-2.5*buttonSize+index*buttonSize, startY+buttonSize, buttonSize);
                    } else {
                        imageText(ingredient, playerIngredients[ingredient] > 0 ? "  V" : "  X", width/2+playerWidth/2-2.5*buttonSize+index*buttonSize, startY+buttonSize, buttonSize, playerIngredients[ingredient] > 0 ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)");
                        if (playerIngredients[ingredient] > 0) {
                            playerIngredients[ingredient]--;
                            ingredientAmounts[ingredient]--;
                        }
                    }
                });
                if (canCraft) {
                    imageButton("arrow", width/2+playerWidth/2-2.5*buttonSize+line1.length*buttonSize, startY+buttonSize, buttonSize, buttonSize, () => {
                        players[turn-1].animals[result]++;
                        line1.forEach((ingredient, index) => {
                            if (ingredient != "") {
                                players[turn-1].animals[ingredient]--;
                            }
                        });
                        line2.forEach((ingredient, index) => {
                            if (ingredient != "") {
                                players[turn-1].animals[ingredient]--;
                            }
                        });
                        line3.forEach((ingredient, index) => {
                            if (ingredient != "") {
                                players[turn-1].animals[ingredient]--;
                            }
                        });
                        renderBackground();
                        renderGame();
                    }, "arrowHover");
                } else {
                    image("arrowNo", width/2+playerWidth/2-2.5*buttonSize+line1.length*buttonSize, startY+buttonSize, buttonSize);
                }
                imageText(result, "  1", width/2+playerWidth/2-2.5*buttonSize+line1.length*buttonSize+buttonSize, startY+buttonSize, buttonSize, "rgb(0, 0, 0)");
                line3.forEach((ingredient, index) => {
                    if (ingredient == "") {
                        image("empty", width/2+playerWidth/2-2.5*buttonSize+index*buttonSize, startY+buttonSize*2, buttonSize);
                    } else {
                        imageText(ingredient, playerIngredients[ingredient] > 0 ? "  V" : "  X", width/2+playerWidth/2-2.5*buttonSize+index*buttonSize, startY+buttonSize*2, buttonSize, playerIngredients[ingredient] > 0 ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)");
                        if (playerIngredients[ingredient] > 0) {
                            playerIngredients[ingredient]--;
                            ingredientAmounts[ingredient]--;
                        }
                    }
                });
                for (let i = 0; i < 5; i++) {
                    shop.shift();
                }
                let ingredientRecipes = shop;
                let recipes = [];
                Object.keys(ingredientAmounts).forEach((ingredient) => {
                    if (ingredientAmounts[ingredient] > 0) {
                        ingredientRecipes.forEach((recipe) => {
                            if (recipe[2] == ingredient) {
                                recipes.push([[recipe[0], recipe[1]], [recipe[2], 1], "leftToRight"]);
                            }
                        });
                    }
                });
                shop = recipes;
                indexY+=2+1/3;
            }
            }
            shop.forEach((item, index) => {
                imageText(item[0][0], String(item[0][1]), startX+buttonSize*indexX*5, startY+buttonSize*indexY*1.5, buttonSize, "rgb(0, 0, 0)");
                if (item[2] == "leftToRight") {
                    image("empty", startX+buttonSize*indexX*5+buttonSize, startY+buttonSize*indexY*1.5, buttonSize);
                } else {
                    if (players[turn-1].animals[item[1][0]] >= item[1][1]) {
                        imageButton("arrowFlip", startX+buttonSize*indexX*5+buttonSize, startY+buttonSize*indexY*1.5, buttonSize, buttonSize, () => {
                            players[turn-1].animals[item[0][0]]+=item[0][1];
                            players[turn-1].animals[item[1][0]]-=item[1][1];
                            renderBackground();
                            renderGame();
                        }, "arrowHoverFlip")
                    } else {
                        image("arrowNoFlip", startX+buttonSize*indexX*5+buttonSize, startY+buttonSize*indexY*1.5, buttonSize);
                    }
                }
                if (players[turn-1].animals[item[0][0]] >= item[0][1]) {
                    imageButton("arrow", startX+buttonSize*indexX*5+buttonSize*2, startY+buttonSize*indexY*1.5, buttonSize, buttonSize, () => {
                        players[turn-1].animals[item[0][0]]-=item[0][1];
                        if (item[0][0] == "celestialTalisman") celestialTalismanUsed = true;
                        if (actionAnimals.includes(item[1][0])) {
                            switch (item[1][0]) {
                                case "squirrel":
                                    players[turn-1].animals[item[1][0]]+=item[1][1];
                                    players[turn-1].setCaps();
                                    break;
                                case "donkey":
                                    players[turn-1].animals[item[1][0]]+=item[1][1];
                                    players[turn-1].setCaps();
                                    break;
                                case "bee":
                                    players[turn-1].animals[item[1][0]]++;
                                    players[turn-1].beeLevelUp();
                                    break;
                                case "bag":
                                    bagBought = true;
                                    activity = "bag";
                                    break;
                                case "cat":
                                    activity = "cat";
                                    break;
                                case "goat":
                                    if (item[1][1] == "X") {
                                        if (players[turn-1].animals["pig"] == "goat") {
                                            players[turn-1].animals["pig"] = 0;
                                        } else if (players[turn-1].animals["cow"] == "goat") {
                                            players[turn-1].animals["cow"] = 0;
                                        } else if (players[turn-1].animals["horse"] == "goat") {
                                            players[turn-1].animals["horse"] = 0;
                                        }
                                    } else {
                                        activity = "goatPlayer"
                                    }
                                    break;
                                case "snake":
                                    shadowTalismanUsed = true;
                                    temp = "snake";
                                    activity = "shadowTalisman";
                                    break;
                                case "fox":
                                    shadowTalismanUsed = true;
                                    temp = "fox";
                                    activity = "shadowTalisman";
                                    break;
                                case "wolf":
                                    shadowTalismanUsed = true;
                                    temp = "wolf";
                                    activity = "shadowTalisman";
                                    break;
                                case "otter":
                                    shadowTalismanUsed = true;
                                    temp = "otter";
                                    activity = "shadowTalisman";
                                    break;
                                case "mouse":
                                    players[turn-1].animals[item[1][0]]++;
                                    players[turn-1].setCaps();
                                    break;
                                case "blueCheese":
                                    playerAmount == 1 ? players[turn-1].animals["blueCheese"]++ : activity = "blueCheese";
                                    break;
                            }
                        } else {
                            players[turn-1].animals[item[1][0]]+=item[1][1];
                        }
                        renderBackground();
                        renderGame();
                    }, ["snake", "fox", "wolf", "otter"].includes(item[1][0]) ? "arrowShadowHover" : item[0][0] == "celestialTalisman" ? "arrowCelestialHover" : "arrowHover");
                } else if (players[turn-1].animals[item[0][0]]+1 >= item[0][1] && aquaticAnimals.includes(item[0][0]) && players[turn-1].animals["frog"] > 0) {
                    imageButton("arrowFrog", startX+buttonSize*indexX*5+buttonSize*2, startY+buttonSize*indexY*1.5, buttonSize, buttonSize, () => {
                        players[turn-1].animals[item[0][0]]-=item[0][1]-1;
                        players[turn-1].animals["frog"]--;
                        players[turn-1].animals[item[1][0]]+=item[1][1];
                        renderBackground();
                        renderGame();
                    }, "arrowFrogHover");
                } else {
                    image("arrowNo", startX+buttonSize*indexX*5+buttonSize*2, startY+buttonSize*indexY*1.5, buttonSize);
                }
                imageText(item[1][0], String(item[1][1]), startX+buttonSize*indexX*5+buttonSize*3, startY+buttonSize*indexY*1.5, buttonSize, item[1][1] == "X" ? "rgb(255, 0, 0)" : "rgb(0, 0, 0)");
                indexX++;
                if (indexX == 3) {
                    indexX = 0;
                    indexY++;
                }
            })
            if (indexX != 0) indexY++;
            textButton("Continue", width/2+playerWidth/2-ctx.measureText("Continue").width/2, startY+buttonSize*indexY*1.5, "rgb(255, 255, 255)", () => {
                shopPage = 1;
                prevShopPages = 0;
                shopPages = 0;
                activity = "tribute";
                if (addons["pond"] && players[turn-1].animals["pond"] > 0) activity = "pond";
                players[turn-1].prune();
                renderBackground();
                renderGame();
            });
            break;
        case "blueCheese":
            renderLine("Choose which player will skip their turn!", 1, "rgb(0, 0, 0)");
            playerList = [];
            players.forEach((player, index) => {
                if (index+1 != turn) {
                    if (player.animals["blueCheese"] == 0) {
                        playerList.push(index);
                    }
                }
            })
            startX = width/2+playerWidth/2+buttonSize/2-buttonSize*playerList.length;
            startY = buttonSize;
            playerList.forEach((player, index) => {
                let color;
                switch (player+1) {
                    case 1:
                        color = "rgb(192, 0, 0)";
                        break;
                    case 2:
                        color = "rgb(0, 192, 0)";
                        break;
                    case 3:
                        color = "rgb(0, 127, 192)";
                        break;
                    case 4:
                        color = "rgb(127, 0, 127)";
                        break;
                }
                colorButton(color, startX+buttonSize*index*2, startY, buttonSize, buttonSize, () => {
                    players[player].animals["blueCheese"]++;
                    activity = "shop";
                    renderBackground();
                    renderGame();
                });
            });
            break;
        case "shadowTalisman":
            text = "Which player do you want to send the "+temp+" to?";
            if (addons["snowFox"]) {
                text = text.replace("fox", "snow fox");
                text = text.replace("otter", "seal");
                text = text.replace("wolf", "ice wolf");
            }
            renderLine(text, 1, "rgb(0, 0, 0)");
            playerList = [];
            players.forEach((player, index) => {
                if (index+1 != turn) {
                    playerList.push(index);
                }
            })
            startX = width/2+playerWidth/2+buttonSize/2-buttonSize*playerList.length;
            startY = buttonSize;
            playerList.forEach((player, index) => {
                let color;
                switch (player+1) {
                    case 1:
                        color = "rgb(192, 0, 0)";
                        break;
                    case 2:
                        color = "rgb(0, 192, 0)";
                        break;
                    case 3:
                        color = "rgb(0, 127, 192)";
                        break;
                    case 4:
                        color = "rgb(127, 0, 127)";
                        break;
                }
                colorButton(color, startX+buttonSize*index*2, startY, buttonSize, buttonSize, () => {
                    switch (temp) {
                        case "snake":
                            players[player].snakeAttack();
                            break;
                        case "fox":
                            players[player].foxAttack();
                            break;
                        case "wolf":
                            players[player].wolfAttack();
                            break;
                        case "otter":
                            players[player].otterAttack();
                            break;
                    }
                    temp = null;
                    activity = "shop";
                    renderBackground();
                    renderGame();
                });
            });
            break;
        case "pond":
            renderLine("Roll the dice!", 1, "rgb(0, 0, 0)");
            imageButton("empty", width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize, buttonSize, () => {
                clearAll();
                pondRoll1 = pondDie1[Math.floor(Math.random()*pondDie1.length)];
                pondRoll2 = pondDie2[Math.floor(Math.random()*pondDie2.length)];
                activity = "pondRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        pondRoll1 = pondDie1[Math.floor(Math.random()*pondDie1.length)];
                        pondRoll2 = pondDie2[Math.floor(Math.random()*pondDie2.length)];
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = "pondResult";
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            });
            imageButton("empty", width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                clearAll();
                pondRoll1 = pondDie1[Math.floor(Math.random()*pondDie1.length)];
                pondRoll2 = pondDie2[Math.floor(Math.random()*pondDie2.length)];
                activity = "pondRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        pondRoll1 = pondDie1[Math.floor(Math.random()*pondDie1.length)];
                        pondRoll2 = pondDie2[Math.floor(Math.random()*pondDie2.length)];
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = "pondResult";
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            });
            break;
        case "pondRoll":
            image(pondRoll1, width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize);
            image(pondRoll2, width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize);
            break;
        case "pondResult":
            text = "You got a" + String(pondRoll1 == "otter" && !addons["snowFox"] ? "n " : " ") + pondRoll1 + " and a " + pondRoll2 + "!";;
            if (addons["snowFox"]) {
                text = text.replace("otter", "seal");
            }
            renderLine(text, 1, "rgb(0, 0, 0)");
            image(pondRoll1, width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize);
            image(pondRoll2, width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize);
            textButton("Continue", width/2+playerWidth/2-ctx.measureText("Continue").width/2, buttonSize*3, "rgb(255, 255, 255)", () => {
                players[turn-1].breed(pondRoll1, pondRoll2);
                players[turn-1].prune();
                activity = "tribute";
                renderBackground();
                renderGame();
            });
            break;
        case "bag":
            renderLine("Open the bag!", 1, "rgb(0, 0, 0)");
            imageButton("bag", width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                bagRoll = bagDie[Math.floor(Math.random()*bagDie.length)];
                activity = "bagRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        bagRoll = bagDie[Math.floor(Math.random()*bagDie.length)];
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = "bagResult"
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            })
            break;
        case "bagRoll":
            renderLine("Open the bag!", 1, "rgb(0, 0, 0)");
            image(bagRoll, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize);
            break;
        case "bagResult":
            text = "";
            if (bagRoll == "eagle" && playerAmount > 1) {
                playerList = [];
                players.forEach((player, index) => {
                    if (index+1 != turn) {
                        if (player.animals["rabbit"] > 0 || player.animals["sheep"] > 0 || 
                            player.animals["pig"] > 0 || player.animals["cow"] > 0 || 
                            player.animals["horse"] > 0 || player.animals["chicken"] > 0) {
                            playerList.push(index);
                        }
                    }
                });
                if (playerList.length == 0) bagRoll = "rabbit"
            }
            switch (bagRoll) {
                case "fox":
                    text = addons["snowFox"] ? "You're attacked by a snow fox!" : "You're attacked by a fox!";
                    break;
                case "snake":
                    text = "You lose a rabbit!";
                    break;
                case "rabbit":
                    text = "You gain a rabbit!";
                    break;
                case "eagle":
                    text = playerAmount > 1 ? "You may steal an animal from another player!" : "The eagle brings you a " + players[turn-1].tribute.animal + "!";
                    break;
            }
            renderLine(text, 1, "rgb(0, 0, 0)");
            imageButton(bagRoll, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                activity = "shop";
                switch (bagRoll) {
                    case "fox":
                        players[turn-1].foxAttack();
                        break;
                    case "snake":
                        players[turn-1].animals["rabbit"]-=Math.min(1, players[turn-1].animals["rabbit"]);
                        break;
                    case "rabbit":
                        players[turn-1].animals["rabbit"]++;
                        break;
                    case "eagle":
                        playerAmount > 1 ? activity = "eaglePlayer" : players[turn-1].animals[players[turn-1].tribute.animal]++;
                        break;
                }
                renderBackground();
                renderGame();
            })
            break;
        case "eaglePlayer":
            renderLine("Choose a player to steal an animal from!", 1, "rgb(0, 0, 0)");
            playerList = [];
            players.forEach((player, index) => {
                if (index+1 != turn) {
                    if (player.animals["rabbit"] > 0 || player.animals["sheep"] > 0 || 
                        player.animals["pig"] > 0 || player.animals["cow"] > 0 || 
                        player.animals["horse"] > 0 || player.animals["chicken"] > 0) {
                        playerList.push(index);
                    }
                }
            });
            startX = width/2+playerWidth/2+buttonSize/2-buttonSize*playerList.length;
            playerList.forEach((player, index) => {
                let color;
                switch (player+1) {
                    case 1:
                        color = "rgb(192, 0, 0)";
                        break;
                    case 2:
                        color = "rgb(0, 192, 0)";
                        break;
                    case 3:
                        color = "rgb(0, 127, 192)";
                        break;
                    case 4:
                        color = "rgb(127, 0, 127)";
                        break;
                }
                colorButton(color, startX+buttonSize*index*2, buttonSize, buttonSize, buttonSize, () => {
                    activity = "eagleAnimal";
                    eagleTemp = player;
                    renderBackground();
                    renderGame();
                });
            });
            break;
        case "eagleAnimal":
            renderLine("Choose an animal to steal!", 1, "rgb(0, 0, 0)");
            animalList = [];
            for (let animal of ["chicken", "rabbit", "sheep", "pig", "cow", "horse"]) {
                if (players[eagleTemp].animals[animal] > 0) {
                    animalList.push(animal);
                }
            }
            startX = width/2+playerWidth/2+buttonSize/2-buttonSize*animalList.length;
            animalList.forEach((animal, index) => {
                imageButton(animal, startX+buttonSize*index*2, buttonSize*2, buttonSize, buttonSize, () => {
                    activity = "shop";
                    players[turn-1].animals[animal]++;
                    players[eagleTemp].animals[animal]--;
                    renderBackground();
                    renderGame();
                });
            });
            break;
        case "cat":
            renderLine("Choose a player to send the cat to!", 1, "rgb(0, 0, 0)");
            playerList = [];
            players.forEach((player, index) => {
                if (index+1 != turn) {
                    if (player.animals["smallDog"] > 0 || player.animals["bigDog"] > 0) {
                        playerList.push(index);
                    }
                }
            });
            startX = width/2+playerWidth/2+buttonSize/2-buttonSize*playerList.length;
            playerList.forEach((player, index) => {
                let color;
                switch (player+1) {
                    case 1:
                        color = "rgb(192, 0, 0)";
                        break;
                    case 2:
                        color = "rgb(0, 192, 0)";
                        break;
                    case 3:
                        color = "rgb(0, 127, 192)";
                        break;
                    case 4:
                        color = "rgb(127, 0, 127)";
                        break;
                }
                colorButton(color, startX+buttonSize*index*2, buttonSize, buttonSize, buttonSize, () => {
                    activity = "shop"
                    players[player].animals["smallDog"]=0;
                    players[player].animals["bigDog"]=0;
                    renderBackground();
                    renderGame();
                });
            });
            break;
        case "goatPlayer":
            playerList = [];
            players.forEach((player, index) => {
                if (index+1 != turn) {
                    if (player.animals["pig"] == 0 || player.animals["cow"] == 0 || player.animals["horse"] == 0) {
                        if (!(player.animals["pig"] == "goat" || player.animals["cow"] == "goat" || player.animals["horse"] == "goat")) {
                            playerList.push(index);
                        }
                    }
                }
            });
            renderLine("Choose a player to send the goat to!", 1, "rgb(0, 0, 0)");
            startX = width/2+playerWidth/2+buttonSize/2-buttonSize*playerList.length;
            playerList.forEach((player, index) => {
                let color;
                switch (player+1) {
                    case 1:
                        color = "rgb(192, 0, 0)";
                        break;
                    case 2:
                        color = "rgb(0, 192, 0)";
                        break;
                    case 3:
                        color = "rgb(0, 127, 192)";
                        break;
                    case 4:
                        color = "rgb(127, 0, 127)";
                        break;
                }
                colorButton(color, startX+buttonSize*index*2, buttonSize, buttonSize, buttonSize, () => {
                    activity = "goatAnimal";
                    goatTemp = player;
                    renderBackground();
                    renderGame();
                });
            });
            break;
        case "goatAnimal":
            renderLine("Choose the pen the goat will occupy!", 1, "rgb(0, 0, 0)");
            animalList = [];
            for (let animal of ["pig", "cow", "horse"]) {
                if (players[goatTemp].animals[animal] == 0) {
                    animalList.push(animal);
                }
            }
            startX = width/2+playerWidth/2+buttonSize/2-buttonSize*animalList.length;
            animalList.forEach((animal, index) => {
                imageButton(animal, startX+buttonSize*index*2, buttonSize*2, buttonSize, buttonSize, () => {
                    activity = "shop";
                    players[goatTemp].animals[animal]="goat";
                    renderBackground();
                    renderGame();
                });
            });
            break;
        case "tribute":
            if (players[turn-1].tribute.animal == "win") {
                removeListeners();
                renderBackground();
                renderEnd();
            } else {
                renderLine("Pay tribute!", 1, "rgb(0, 0, 0)");
                if (players[turn-1].animals[players[turn-1].tribute.animal] > 0) {
                    imageTextButton(players[turn-1].tribute.animal, String(3-players[turn-1].tribute.amount)+"/3", width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, "rgb(0, 0, 0)", () => {
                        players[turn-1].payTribute();
                        renderBackground();
                        renderGame();
                    });
                } else {
                    imageText(players[turn-1].tribute.animal, String(3-players[turn-1].tribute.amount)+"/3", width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, "rgb(255, 0, 0)");
                }
                textButton("Continue", width/2+playerWidth/2-ctx.measureText("Continue").width/2, buttonSize*3, "rgb(255, 255, 255)", () => {
                    if (addons["ufo"] && Math.random() < 1/3) {
                        activity = "ufoInit";
                    } else if (addons["shadowBeast"]) {
                        activity = "night";
                    } else {
                        nextTurn();
                    }
                    renderBackground();
                    renderGame();
                });
            }
            break;
        case "ufoInit":
            renderLine("A UFO appears! It invites you to a game!", 1, "rgb(0, 0, 0)");
            imageButton("ufo", width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                ufoAnimals = ufoAnimals.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
                activity = "ufo";
                renderBackground();
                renderGame();
            })
            break;
        case "ufo":
            text = "";
            if (ufoChoice1 == -1) {
                text = "Choose 3 animals!";
            } else if (ufoChoice2 == -1) {
                text = "Choose 2 animals!";
            } else if (ufoChoice3 == -1) {
                text = "Choose 1 animal!";
            } else {
                text = "Get your reward!";
            }
            renderLine(text, 1, "rgb(0, 0, 0)");
            if (ufoChoice1 == -1 || ufoChoice2 == -1 || ufoChoice3 == -1) {
                startX = width/2+playerWidth/2-buttonSize*4.25;
                startY = buttonSize;
                indexX = 0;
                indexY = 0;
                ufoAnimals.forEach((animal, index) => {
                    if (index == ufoChoice1 || index == ufoChoice2 || index == ufoChoice3) {
                        image(animal, startX+buttonSize*indexX*1.5, startY+buttonSize*indexY*1.5, buttonSize);
                    } else {
                        imageButton("empty", startX+buttonSize*indexX*1.5, startY+buttonSize*indexY*1.5, buttonSize, buttonSize, () => {
                            if (ufoChoice1 == -1) {
                                ufoChoice1 = index;
                            } else if (ufoChoice2 == -1) {
                                ufoChoice2 = index;
                            } else if (ufoChoice3 == -1) {
                                ufoChoice3 = index;
                            }
                            renderBackground();
                            renderGame();
                        });
                    }
                    indexX++;
                    if (indexX == 6) {
                        indexX = 0;
                        indexY++;
                    }
                });
            } else {
                image(ufoAnimals[ufoChoice1], width/2+playerWidth/2-buttonSize*7/2, buttonSize, buttonSize);
                ctx.fillText("+", width/2+playerWidth/2-buttonSize*2-ctx.measureText("M").width/2, buttonSize*3/2+ctx.measureText("M").width/2);
                image(ufoAnimals[ufoChoice2], width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize);
                ctx.fillText("+", width/2+playerWidth/2-ctx.measureText("M").width/2, buttonSize*3/2+ctx.measureText("M").width/2);
                image(ufoAnimals[ufoChoice3], width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize);
                ctx.fillText("=", width/2+playerWidth/2+buttonSize*2-ctx.measureText("M").width/2, buttonSize*3/2+ctx.measureText("M").width/2);
                if (ufoReward == "") {
                    ufoArr = new Set([ufoAnimals[ufoChoice1], ufoAnimals[ufoChoice2], ufoAnimals[ufoChoice3]]);
                    if (ufoArr.has("wolf")) {
                        ufoReward = "wolf";
                    } else if (ufoArr.size == 3) {
                        if (ufoArr.has("horse")) {
                            ufoReward = "horse";
                        } else if (ufoArr.has("cow")) {
                            ufoReward = "cow";
                        } else if (ufoArr.has("pig")) {
                            ufoReward = "pig";
                        } else if (ufoArr.has("sheep")) {
                            ufoReward = "sheep";
                        } else if (ufoArr.has("rabbit")) {
                            ufoReward = "rabbit";
                        }
                    } else if (ufoArr.size == 2) {
                        ufoReward = "empty";
                    } else if (ufoArr.size == 1) {
                        ufoReward = ufoAnimals[ufoChoice1];
                    }
                }
                    imageTextButton(ufoReward, ufoArr.has("wolf") || ufoArr.size == 3 ? "1" : ufoArr.size == 2 ? "0" : "2", width/2+playerWidth/2+buttonSize*5/2, buttonSize, buttonSize, "rgb(0, 0, 0)", () => {
                        if (addons["shadowBeast"]) {
                            activity = "night";
                        } else {
                            nextTurn();
                        }
                        if (ufoReward == "wolf") {
                            players[turn-1].wolfAttack();
                        } else if (ufoReward != "empty") {
                            players[turn-1].animals[ufoReward]+= ufoArr.size == 1 ? 2 : 1;
                        }
                        ufoReward = "";
                        ufoChoice1 = -1;
                        ufoChoice2 = -1;
                        ufoChoice3 = -1;
                        ufoArr = new Set();
                        renderBackground();
                        renderGame();
                    });
            }
            break;
        case "night":
            players[turn-1].animals["nightmare"]*=0;
            players[turn-1].animals["unicorn"]*=0;
            players[turn-1].setCaps();
            renderLine("See what the night brings!", 1, "rgb(0, 0, 0)");
            imageButton("empty", width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                clearAll();
                nightOutput = nightDie[Math.floor(Math.random()*nightDie.length)];
                activity = "nightRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        nightOutput = nightDie[Math.floor(Math.random()*nightDie.length)];
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = "nightResult";
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            });
            break;
        case "nightRoll":
            renderLine("See what the night brings!", 1, "rgb(0, 0, 0)");
            image(nightOutput, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize);
            break;
        case "nightResult":
            if (players[turn-1].animals["shadowTalisman"] > 0 && nightOutput == "unicorn") nightOutput = "shadowBeast";
            if (players[turn-1].animals["celestialTalisman"] > 0 && nightOutput == "nightmare") nightOutput = "celestialDeer";
            text = "";
            temp = "";
            for (let animal of ["chicken", "rabbit", "sheep", "pig", "cow", "horse"]) {
                if (players[turn-1].animals[animal] > 0) {
                    temp = animal;
                }
            }
            if (temp == "" && nightOutput == "shadowBeast") {
                nightOutput = "empty";
            }
            temp = null;
            switch (nightOutput) {
                case "shadowBeast":
                    if (players[turn-1].animals["shadowTalisman"] > 0) {
                        text = "The Shadow Beast consumes your smallest animal!";
                    } else if (players[turn-1].animals["celestialTalisman"] > 0) {
                        text = "The Shadow Beast is repelled by the Celestial Talisman, destroying it in the process!";
                    } else {
                        text = "The Shadow Beast consumes your largest animal and offers you a talisman!";
                    }
                    break;
                case "nightmare":
                    text = "The Nightmare lowers your animal caps for a turn!";
                    break;
                case "empty":
                    text = "Nothing happens.";
                    break;
                case "unicorn":
                    text = "A Unicorn blesses you with higher breeding yields for a turn!";
                    break;
                case "celestialDeer":
                    if (players[turn-1].animals["shadowTalisman"] > 0) {
                        text = "The Celestial Deer destroys the source of evil energy emanating from you!";
                    } else if (players[turn-1].animals["celestialTalisman"] > 0) {
                        text = "The Celestial Deer grants you an animal it deems you worthy of!";
                    } else {
                        text = "The Celestial Deer offers you a choice!";
                    }
                    break;
            }
            renderLine(text, 1, "rgb(0, 0, 0)");
            imageButton(nightOutput, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                activity = "";
                switch (nightOutput) {
                    case "shadowBeast":
                        if (players[turn-1].animals["celestialTalisman"] > 0) {
                            players[turn-1].animals["celestialTalisman"]--;
                        } else {
                            let shadowBeastAnimal = "";
                            let shadowBeastArray = ["chicken", "rabbit", "sheep", "pig", "cow", "horse"];
                            if (players[turn-1].animals["shadowTalisman"] > 0) shadowBeastArray.reverse();
                            for (let animal of shadowBeastArray) {
                                if (players[turn-1].animals[animal] > 0) {
                                    shadowBeastAnimal = animal;
                                }
                            }
                            players[turn-1].animals[shadowBeastAnimal]--;
                            if (players[turn-1].animals["shadowTalisman"] == 0) {
                                activity = "shadowBeast";
                            }
                        }
                        break;
                    case "nightmare":
                        players[turn-1].animals["nightmare"]++;
                        players[turn-1].setCaps();
                        players[turn-1].prune();
                        break;
                    case "unicorn":
                        players[turn-1].animals["unicorn"]++;
                        break;
                    case "celestialDeer":
                        if (players[turn-1].animals["shadowTalisman"] > 0) {
                            players[turn-1].animals["shadowTalisman"]--;
                        } else {
                            activity = "celestialDeer";
                        }
                        break;
                }
                if (activity == "") {
                    nextTurn();
                }
                renderBackground();
                renderGame();
            });
            break;
        case "shadowBeast":
            renderLine("The Shadow Beast offers you a cursed talisman!", 1, "rgb(0, 0, 0)");
            imageButton("shadowTalisman", width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize, buttonSize, () => {
                players[turn-1].animals["shadowTalisman"]++;
                nextTurn();
                renderBackground();
                renderGame();
            });
            imageTextButton("empty","  X" , width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize, "rgb(255, 0, 0)", () => {
                nextTurn();
                renderBackground();
                renderGame();
            });
            break;
        case "celestialDeer":
            if (players[turn-1].animals["celestialTalisman"] > 0) {
                renderLine("The Celestial Deer grants you an animal it deems you worthy of!", 1, "rgb(0, 0, 0)");
                imageButton(players[turn-1].tribute.animal, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                    players[turn-1].animals[players[turn-1].tribute.animal]++;
                    nextTurn();
                    renderBackground();
                    renderGame();
                });
            } else {
                renderLine("The Celestial Deer offers you a choice!", 1, "rgb(0, 0, 0)");
                imageButton("celestialTalisman", width/2+playerWidth/2-buttonSize*3/2, buttonSize, buttonSize, buttonSize, () => {
                    players[turn-1].animals["celestialTalisman"]++;
                    nextTurn();
                    renderBackground();
                    renderGame();
                });
                imageButton(players[turn-1].tribute.animal, width/2+playerWidth/2+buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                    players[turn-1].animals[players[turn-1].tribute.animal]++;
                    nextTurn();
                    renderBackground();
                    renderGame();
                });
            }
            break;
        case "global":
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.fillRect(playerWidth, 0, width-playerWidth, height);
            ctx.strokeRect(playerWidth, 0, width-playerWidth, height);
            ctx.fillStyle = "rgb(0, 0, 0)";
            renderLine("Event turn!", 0, "rgb(0, 0, 0)");
            renderLine("Roll the event die!", 1, "rgb(0, 0, 0)");
            imageButton("empty", width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                clearAll();
                storkOutput = storkDie[Math.floor(Math.random()*storkDie.length)];
                activity = "globalRoll";
                new Promise((resolve, reject) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        index++;
                        storkRoll = storkDie[Math.floor(Math.random()*storkDie.length)];
                        renderBackground();
                        renderGame();
                        if (index >= 100) {
                            activity = "globalResult";
                            renderBackground();
                            renderGame();
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                });
                renderBackground();
                renderGame();
            });
            break;
        case "globalRoll":
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.fillRect(playerWidth, 0, width-playerWidth, height);
            ctx.strokeRect(playerWidth, 0, width-playerWidth, height);
            ctx.fillStyle = "rgb(0, 0, 0)";
            renderLine("Event turn!", 0, "rgb(0, 0, 0)");
            renderLine("Roll the event die!", 1, "rgb(0, 0, 0)");
            image(storkRoll, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize);
            break;
        case "globalResult":
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.fillRect(playerWidth, 0, width-playerWidth, height);
            ctx.strokeRect(playerWidth, 0, width-playerWidth, height);
            ctx.fillStyle = "rgb(0, 0, 0)";
            renderLine("Event turn!", 0, "rgb(0, 0, 0)");
            text = "";
            switch (storkRoll) {
                case "empty":
                    text = "Nothing happens.";
                    break;
                case "stork":
                    text = "Each player gets a stork!";
                    break;
                case "antiStork":
                    text = "Each player loses a stork!";
                    break;
                case "antiWater":
                    text = "Each player loses 1 water!";
                    break;
                case "water":
                    text = "Each player gains 1 water!";
                    break;
            }
            renderLine(text, 1, "rgb(0, 0, 0)");
            imageButton(storkRoll, width/2+playerWidth/2-buttonSize/2, buttonSize, buttonSize, buttonSize, () => {
                activity = addons["skunk"] ? "skunk" : "breed";
                switch (storkRoll) {
                    case "empty":
                        break;
                    case "stork":
                        players.forEach((player) => {
                            player.animals["stork"]++;
                            player.prune();
                        });
                        break;
                    case "antiStork":
                        players.forEach((player) => {
                            player.animals["stork"]-=Math.min(1, player.animals["stork"]);
                        });
                        break;
                    case "antiWater":
                        players.forEach((player) => {
                            player.animals["water"]-=Math.min(1, player.animals["water"]);
                        });
                        break;
                    case "water":
                        players.forEach((player) => {
                            player.animals["water"]++;
                            player.prune();
                        });
                }
                turn = 1;
                renderBackground();
                renderGame();
            });
            break;
    }
}

function initGame() {
    if (playerAmount == 1) addons["cat"] = false;
    for (let i = 0; i < playerAmount; i++) {
        players.push(new Player("Player "+(i+1)));
        players.forEach((player) => {
            player.setCaps();
        })
    }
    if (addons["chicken"]) {
        die1 = ["chicken","chicken","chicken","chicken","rabbit","rabbit",
                "rabbit","sheep","sheep","pig","horse","wolf"];
        die2 = ["chicken","chicken","chicken","chicken","rabbit","rabbit",
                "sheep","sheep","pig","pig","cow","fox"];
    }
    if (addons["lettuce"] && addons["stork"]) {
        storkDie = ["stork","stork","empty","water","water","water"]
    } else if (addons["lettuce"]) {
        storkDie = ["antiWater","empty","water","water","water","water"]
    }
    if (addons["skunk"]) {
        activity = "skunk";
    }
    if (addons["snowFox"]) {
        images["fox"] = images["snowFox"];
        images["wolf"] = images["iceWolf"];
        images["otter"] = images["seal"];
    }
    if (playerAmount == 1 && addons["goat"]) {
        players[0].animals["pig"]="goat";
        players[0].animals["cow"]="goat";
        players[0].animals["horse"]="goat";
    }
    turn = 0;
    nextTurn();
}

function renderChooseAddons() {
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.lineWidth = 2;
    ctx.font = "1px pixel";
    ctx.font = String(width/2/ctx.measureText("Choose addons").width)+"px pixel";
    ctx.strokeText("Choose addons", width/2-ctx.measureText("Choose addons").width/2, ctx.measureText("M").width);
    ctx.fillText("Choose addons", width/2-ctx.measureText("Choose addons").width/2, ctx.measureText("M").width);
    let indexX = 0;
    let indexY = 0;
    let amount = Math.ceil(Object.keys(addons).length/2);
    let size = width/(amount*1.5+0.5);
    for (let [addon, bool] of Object.entries(addons)) {
        if (playerAmount == 1 && addon == "cat") continue;
        let addonImage;
        switch (addon) {
            case "bee":
                addonImage = "bear";
                break;
            case "lettuce":
                addonImage = "pumpkin";
                break;
            default:
                addonImage = addon;
                break;
        }
        imageTextButton(addonImage, bool ? "  V" : "  X", size/2+size*indexX*3/2, height/2-size*5/4+size*indexY*3/2, size, bool ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)", () => {
            addons[addon] = !addons[addon];
            localStorage.setItem("addons", JSON.stringify(addons));
            renderBackground();
            renderChooseAddons();
        });
        indexX++;
        if (indexX == amount) {
            indexX = 0;
            indexY++;
        }
    }
    ctx.font = "1px pixel";
    ctx.font = String(width/6/ctx.measureText("Start").width)+"px pixel";
    textButton("Start", width/2-ctx.measureText("Start").width/2, height-ctx.measureText("M").width, "rgb(0, 127, 0)", () => {
        state = "game";
        initGame();
    });
}

function renderChooseAddonsMobile() {
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.lineWidth = 2;
    ctx.font = "1px pixel";
    ctx.font = String(width/ctx.measureText("Choose addons").width)+"px pixel";
    ctx.strokeText("Choose addons", width/2-ctx.measureText("Choose addons").width/2, ctx.measureText("M").width);
    ctx.fillText("Choose addons", width/2-ctx.measureText("Choose addons").width/2, ctx.measureText("M").width);
    let indexX = 0;
    let indexY = 0;
    let amount = 4;
    let size = width/(amount*1.5+0.5);
    for (let [addon, bool] of Object.entries(addons)) {
        imageTextButton(addon, bool ? "  V" : "  X", size/2+size*indexX*3/2, height/4-size*5/4+size*indexY*3/2, size, bool ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)", () => {
            addons[addon] = !addons[addon];
            localStorage.setItem("addons", JSON.stringify(addons));
            renderBackground();
            renderChooseAddons();
        });
        indexX++;
        if (indexX == amount) {
            indexX = 0;
            indexY++;
        }
    }
    ctx.font = "1px pixel";
    ctx.font = String(width/3/ctx.measureText("Start").width)+"px pixel";
    textButton("Start", width/2-ctx.measureText("Start").width/2, height-ctx.measureText("M").width, "rgb(0, 127, 0)", () => {
        state = "game";
        initGame();
    });
}

function renderSelectPlayers() {
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.lineWidth = 2;
    ctx.font = "1px pixel";
    ctx.font = String(width/2/ctx.measureText("Select players").width)+"px pixel";
    ctx.strokeText("Select players", width/2-ctx.measureText("Select players").width/2, ctx.measureText("M").width);
    ctx.fillText("Select players", width/2-ctx.measureText("Select players").width/2, ctx.measureText("M").width);
    if (!singleEnabled) {
        charButton("2", width/10, height/2-width/10, width/5, "rgb(0, 192, 0)", () => {
            playerAmount = 2;
            state = "addons";
            renderBackground();
            renderChooseAddons();
        });
        charButton("3", 2*width/5, height/2-width/10, width/5, "rgb(0, 127, 192)", () => {
            playerAmount = 3;
            state = "addons";
            renderBackground();
            renderChooseAddons();
        });
        charButton("4", 7*width/10, height/2-width/10, width/5, "rgb(127, 0, 127)", () => {
            playerAmount = 4;
            state = "addons";
            renderBackground();
            renderChooseAddons();
        });
    } else {
        charButton("1", width/13, height/2-width/13, 2*width/13, "rgb(192, 0, 0)", () => {
            playerAmount = 1;
            state = "addons";
            renderBackground();
            renderChooseAddons();
        });
        charButton("2", 4*width/13, height/2-width/13, 2*width/13, "rgb(0, 192, 0)", () => {
            playerAmount = 2;
            state = "addons";
            renderBackground();
            renderChooseAddons();
        });
        charButton("3", 7*width/13, height/2-width/13, 2*width/13, "rgb(0, 127, 192)", () => {
            playerAmount = 3;
            state = "addons";
            renderBackground();
            renderChooseAddons();
        });
        charButton("4", 10*width/13, height/2-width/13, 2*width/13, "rgb(127, 0, 127)", () => {
            playerAmount = 4;
            state = "addons";
            renderBackground();
            renderChooseAddons();
        });
    }
}

function renderSelectPlayersMobile() {
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.lineWidth = 2;
    ctx.font = "1px pixel";
    ctx.font = String(width/ctx.measureText("Select players").width)+"px pixel";
    ctx.strokeText("Select players", width/2-ctx.measureText("Select players").width/2, ctx.measureText("M").width);
    ctx.fillText("Select players", width/2-ctx.measureText("Select players").width/2, ctx.measureText("M").width);
    if (!singleEnabled) {
        charButton("2", width/2-height/10, height/10, height/5, "rgb(0, 192, 0)", () => {
            playerAmount = 2;
            state = "addons";
            renderBackground();
            renderChooseAddonsMobile();
        });
        charButton("3", width/2-height/10, 2*height/5, height/5, "rgb(0, 127, 192)", () => {
            playerAmount = 3;
            state = "addons";
            renderBackground();
            renderChooseAddonsMobile();
        });
        charButton("4", width/2-height/10, 7*height/10, height/5, "rgb(127, 0, 127)", () => {
            playerAmount = 4;
            state = "addons";
            renderBackground();
            renderChooseAddonsMobile();
        });
    } else {
        charButton("1", width/2-height/13, height/13, 2*height/13, "rgb(192, 0, 0)", () => {
            playerAmount = 1;
            state = "addons";
            renderBackground();
            renderChooseAddonsMobile();
        });
        charButton("2", width/2-height/13, 4*height/13, 2*height/13, "rgb(0, 192, 0)", () => {
            playerAmount = 2;
            state = "addons";
            renderBackground();
            renderChooseAddonsMobile();
        });
        charButton("3", width/2-height/13, 7*height/13, 2*height/13, "rgb(0, 127, 192)", () => {
            playerAmount = 3;
            state = "addons";
            renderBackground();
            renderChooseAddonsMobile();
        });
        charButton("4", width/2-height/13, 10*height/13, 2*height/13, "rgb(127, 0, 127)", () => {
            playerAmount = 4;
            state = "addons";
            renderBackground();
            renderChooseAddonsMobile();
        });
    
    }
}

let currentAnimalInstruction = "";
let currentInstructionSection = "";

function renderInstructions() {
    let buttonSize = width/20;
    imageButton("arrowFlip", 0, 0, buttonSize, buttonSize, () => {
        state = "menu";
        renderBackground();
        renderMenu();
    }, "arrowHoverFlip");
    let indexX = 0;
    let indexY = 0;
    let amount = Math.ceil(Object.keys(addons).length/2)+1;
    let size = width/(amount*1.5+0.5);
    imageTextButton("empty", {length:4, 0:"base", 1:"", 2:"", 3:"game"}, size/2+size*indexX*3/2, height/2-size*5/4+size*indexY*3/2, size, "rgb(0, 0, 0)", () => {
        state = "instructionChapter";
        currentInstructionSection = "base";
        renderBackground();
        renderInstructionChapter();
    });
    indexX++;
    for (let [addon, bool] of Object.entries(addons)) {
        if (playerAmount == 1 && addon == "cat") continue;
        let addonImage;
        switch (addon) {
            case "bee":
                addonImage = "bear";
                break;
            case "lettuce":
                addonImage = "pumpkin";
                break;
            default:
                addonImage = addon;
                break;
        }
        imageButton(addonImage, size/2+size*indexX*3/2, height/2-size*5/4+size*indexY*3/2, size, size, () => {
            state = "instructionChapter";
            currentInstructionSection = addon;
            renderBackground();
            renderInstructionChapter();
        });
        indexX++;
        if (indexX == amount) {
            indexX = 0;
            indexY++;
        }
    }
    // for (let [animal, instructions] of Object.entries(animalInstructions)) {
    //     imageButton(animal, startX+buttonSize*indexX, startY+buttonSize*indexY, buttonSize, buttonSize, () => {
    //         state = "animalInstructions";
    //         currentAnimalInstruction = animal;
    //         renderBackground();
    //         renderAnimalInstructions();
    //     });
    //     indexX++;
    //     if (indexX == 16) {
    //         indexX = 0;
    //         indexY++;
    //     }
    // };
}

function renderInstructionChapter() {
    let buttonSize = width/20;
    imageButton("arrowFlip", 0, 0, buttonSize, buttonSize, () => {
        state = "instructions";
        renderBackground();
        renderInstructions();
    }, "arrowHoverFlip");
    ctx.font = "1px pixel";
    ctx.font = String(width/10/ctx.measureText("Sample").width)+"px pixel";
    let chapterHeader = "";
    let buttonList = [];
    switch (currentInstructionSection) {
        case "base":
            chapterHeader = "Base Game:";
            buttonList = ["rabbit", "sheep", "pig", "cow", "horse", "smallDog", "bigDog", "fox", "wolf"];
            break;
        case "stork":
            chapterHeader = "Stork Addon:";
            buttonList = ["stork"];
            break;
        case "badger":
            chapterHeader = "Badger Addon:";
            buttonList = ["badger"];
            break;
        case "goat":
            chapterHeader = "Goat Addon:";
            buttonList = ["goat"];
            break;
        case "cat":
            chapterHeader = "Cat Addon:";
            buttonList = ["cat"];
            break;
        case "chicken":
            chapterHeader = "Chicken Addon:";
            buttonList = ["chicken", "rooster", "wood", "coop"];
            break;
        case "blackSheep":
            chapterHeader = "Black Sheep Addon:";
            buttonList = ["blackSheep"];
            break;
        case "eagle":
            chapterHeader = "Eagle Addon:";
            buttonList = ["bag", "snake", "eagle"];
            break;
        case "skunk":
            chapterHeader = "Skunk Addon:";
            buttonList = ["skunk", "snake", "boar", "owl"];
            break;
        case "bee":
            chapterHeader = "Bear Addon:";
            buttonList = ["bear", "bee", "honey", "bonusTurn"];
            break;
        case "pegasus":
            chapterHeader = "Pegasus Addon:";
            buttonList = ["pegasus", "squirrel", "donkey"];
            break;
        case "shadowBeast":
            chapterHeader = "Shadow Beast Addon:";
            buttonList = ["shadowBeast", "shadowTalisman", "nightmare", "unicorn", "celestialDeer", "celestialTalisman"];
            break;
        case "lettuce":
            chapterHeader = "Pumpkin Addon:";
            buttonList = ["water", "lettuce", "crow", "scarecrow", "stick", "hay", "pumpkin"];
            break;
        case "pond":
            chapterHeader = "Pond Addon:";
            buttonList = ["pond", "cod", "salmon", "duck", "beaver", "hippocampus", "otter", "turtle", "frog"];
            break;
        case "alpaca":
            chapterHeader = "Alpaca Addon:";
            buttonList = ["alpaca"]
            break;
        case "cheese":
            chapterHeader = "Cheese Addon:";
            buttonList = ["milk", "mouse", "cheese", "cheddar", "brie", "blueCheese", "gouda"];
            break;
        case "snowFox":
            chapterHeader = "Snow Fox Addon:";
            buttonList = ["snowFox", "iceWolf", "seal"];
            break;
        case "ufo":
            chapterHeader = "UFO Addon:";
            buttonList = ["ufo"];
            break;
    }
    ctx.fillText(chapterHeader, width/2-ctx.measureText(chapterHeader).width/2, ctx.measureText("M").width);
    let indexX = 0;
    let indexY = 0;
    let amount = Math.ceil(Object.keys(addons).length/2)+1;
    let size = width/(amount*1.5+0.5);
    for (let image of buttonList) {
        imageButton(image, size/2+size*indexX*3/2, height/2-size*5/4+size*indexY*3/2, size, size, () => {
            state = "animalInstructions";
            currentAnimalInstruction = image;
            renderBackground();
            renderAnimalInstructions();
        });
        indexX++;
        if (indexX == amount) {
            indexX = 0;
            indexY++;
        }
    }
}

let animalInstructions = {
    "chicken": {
        "name": "Chicken", 
        "description": "Becomes the starting animal before the rabbit. Consumed by the fox.",
        "cap": 32,
        "type": "Progression"
    },
    "rooster": {
        "name": "Rooster", 
        "description": "When chickens are bred, provides an additional 1 chicken for each 3 already owned.",
        "cap": 1,
        "type": "Buffing"
    },
    "rabbit": {
        "name": "Rabbit", 
        "description": "Default starting animal.",
        "cap": 20,
        "type": "Progression"
    },
    "sheep": {
        "name": "Sheep", 
        "description": "Next animal after the rabbit. Can be used to buy a small dog.",
        "cap": 12,
        "type": "Progression"
    },
    "blackSheep": {
        "name": "Black Sheep", 
        "description": "Exchangable for 1 sheep. Doesn't breed, but survives all predator attacks. Useful as a backup sheep in case of emergency.",
        "cap": 1,
        "type": "Tradable"
    },
    "pig": {
        "name": "Pig", 
        "description": "Next animal after the sheep.",
        "cap": 8,
        "type": "Progression"
    },
    "cow": {
        "name": "Cow", 
        "description": "Next animal after the pig. Can be used to buy a big dog.",
        "cap": 6,
        "type": "Progression, Generating"
    },
    "horse": {
        "name": "Horse", 
        "description": "Next animal after the cow. The last animal in the progression of the base game.",
        "cap": 4,
        "type": "Progression"
    },
    "smallDog": {
        "name": "Small Dog", 
        "description": "Protects against fox attacks at the cost of its life.",
        "cap": 2,
        "type": "Protective"
    },
    "bigDog": {
        "name": "Big Dog", 
        "description": "Protects against wolf attacks at the cost of its life.",
        "cap": 2,
        "type": "Protective"
    },
    "fox": {
        "name": "Fox", 
        "description": "Eats all but 1 rabbit.",
        "cap": "none",
        "type": "Predator"
    },
    "wolf": {
        "name": "Wolf", 
        "description": "Eats all sheep, pigs, and cows.",
        "cap": "none",
        "type": "Predator"
    },
    "stork": {
        "name": "Stork", 
        "description": "Randomly arrives and departs between last and first players' turns. 2 can be exchanged for 1 of an animal that has just succesfully bred.",
        "cap": 4,
        "type": "Tradable"
    },
    "badger": {
        "name": "Badger", 
        "description": "Goes to the player who's just been attacked by a fox, wolf, or an otter. Can breed as any animal.",
        "cap": "global cap of 1",
        "type": "Buffing"
    },
    "goat": {
        "name": "Goat", 
        "description": "Costs 1 sheep to be sent to another player's empty pen, blocking its corresponding animal for being gained by breeding or trading. Can be gotten rid of by paying 3 sheep or being attacked by a wolf without a big dog. In single player, pig, cow, and horse pens are occupied by it at the beginning of the game and wolf attack don't work against it.",
        "cap": "none",
        "type": "Debuffing"
    },
    "cat": {
        "name": "Cat", 
        "description": "Costs 1 pig to be sent to another player's farm, scaring away all their dogs. Not present in singleplayer mode.",
        "cap": "none",
        "type": "Offensive"
    },
    "bag": {
        "name": "Bag", 
        "description": "Costs 1 sheep and can only be bought once per turn. Contains one of the following: fox, snake, rabbit, eagle.",
        "cap": "none",
        "type": "Consumable"
    },
    "eagle": {
        "name": "Eagle", 
        "description": "Used to steal another player's animal. In singleplayer it instead brings the current tribute animal.",
        "cap": "none",
        "type": "Offensive, Generating"
    },
    "snake": {
        "name": "Snake", 
        "description": "Eats one rabbit.",
        "cap": "none",
        "type": "Predator"
    },
    "skunk": {
        "name": "Skunk", 
        "description": "In multiplayer: makes the player skip a turn. In singleplayer: makes all but one chicken, rabbit, sheep, and pig run away.",
        "cap": "none",
        "type": "Debuffing"
    },
    "boar": {
        "name": "Boar", 
        "description": "Triggers pig breeding and counts as a pig during it.",
        "cap": 1,
        "type": "Buffing"
    },
    "owl": {
        "name": "Owl", 
        "description": "Can join the player for a price of 4 rabbits. Brings a rabbit every turn and protects against skunk attacks at the cost of its life.",
        "cap": 1,
        "type": "Protective"
    },
    "bee": {
        "name": "Bee", 
        "description": "Bought with 2 rabbits. Levelled up with honey.",
        "cap": "lvl 5",
        "type": "Generating"
    },
    "honey": {
        "name": "Honey", 
        "description": "Used for levelling up the bee, buying rabbits, and calming down the bear.",
        "cap": 6,
        "type": "Resource"
    },
    "bear": {
        "name": "Bear", 
        "description": "Has a 10% chance to arrive before the trading phase. Eats the largest animal available or 3 honey.",
        "cap": "none",
        "type": "Predator"
    },
    "bonusTurn": {
        "name": "Energetic Honey", 
        "description": "In multiplayer: Provides the player with a bonus turn. In singleplayer: Increases breeding yields by 1.",
        "cap": 1,
        "type": "Buffing"
    },
    "squirrel": {
        "name": "Squirrel", 
        "description": "Decreases progression animals' caps by 1 for every 4 squirrels on the farm.",
        "cap": 16,
        "type": "Debuffing"
    },
    "donkey": {
        "name": "Donkey", 
        "description": "Increases progression animals' caps by 4. Stops squirrels from spawning.",
        "cap": 1,
        "type": "Buffing"
    },
    "pegasus": {
        "name": "Pegasus", 
        "description": "Next animal after the horse.",
        "cap": 0,
        "type": "Progression"
    },
    "shadowBeast": {
        "name": "Shadow Beast", 
        "description": "Eats the largest animal available and offers the shadow talisman.",
        "cap": "none",
        "type": "Predator"
    },
    "celestialDeer": {
        "name": "Celestial Deer", 
        "description": "Gives the current tribute animal and offers the celestial talisman.",
        "cap": "none",
        "type": "Generating"
    },
    "unicorn": {
        "name": "Unicorn", 
        "description": "Increases breeding yields by 1.",
        "cap": 1,
        "type": "Buffing"
    },
    "nightmare": {
        "name": "Nightmare", 
        "description": "Decreases progression animals' caps by 2.",
        "cap": 1,
        "type": "Debuffing"
    },
    "celestialTalisman": {
        "name": "Celestial Talisman", 
        "description": "Doubles the chance of meeting the celestial deer. Removes nightmare encounters. Nullifies a shadow beast encounter, but is then removed. In multiplayer: unlocks trades that let the player acquire protective animals for free. In singleplayer: makes the player roll with advantage.",
        "cap": 1,
        "type": "Buffing, Protective, Generating"
    },
    "shadowTalisman": {
        "name": "Shadow Talisman", 
        "description": "Doubles the chance of meeting the shadow beast. Removes unicorn encounters. Nullifies a celestial deer encounter, but is then removed. In singleplayer: unlocks trades that let the player send predators to other players. In singleplayer: makes the player roll with disadvantage.",
        "cap": 1,
        "type": "Buffing, Debuffing, Offensive"
    },
    "water": {
        "name": "Water", 
        "description": "Randomly arrives and departs between last and first players' turns.",
        "cap": 4,
        "type": "Resource"
    },
    "stick": {
        "name": "Stick", 
        "description": "Crafting material used for crafting the scarecrow.",
        "cap": "none",
        "type": "Material"
    },
    "lettuce": {
        "name": "Lettuce", 
        "description": "Increases breeding yields by 1.",
        "cap": 1,
        "type": "Buffing"
    },
    "hay": {
        "name": "Hay", 
        "description": "Crafting material used for crafting the scarecrow.",
        "cap": "none",
        "type": "Material"
    },
    "pumpkin": {
        "name": "Pumpkin", 
        "description": "Crafting material used for crafting the scarecrow.",
        "cap": "none",
        "type": "Material"
    },
    "scarecrow": {
        "name": "Scarecrow", 
        "description": "Stops crows from spawning",
        "cap": 1,
        "type": "Structure"
    },
    "crow": {
        "name": "Crow", 
        "description": "Decreases breeding yields by 1 for every 4 crows.",
        "cap": 16,
        "type": "Debuffing"
    },
    "pond": {
        "name": "Pond", 
        "description": "Allows for breeding and trading of water animals.",
        "cap": 1,
        "type": "Structure"
    },
    "cod": {
        "name": "Cod", 
        "description": "The cheapest one.",
        "cap": 20,
        "type": "Water"
    },
    "salmon": {
        "name": "Salmon", 
        "description": "Next animal after the cod.",
        "cap": 12,
        "type": "Water"
    },
    "duck": {
        "name": "Duck", 
        "description": "Next animal after the salmon.",
        "cap": 8,
        "type": "Water"
    },
    "beaver": {
        "name": "Beaver", 
        "description": "Next animal after the duck.",
        "cap": 6,
        "type": "Water"
    },
    "hippocampus": {
        "name": "Hippocampus", 
        "description": "Next animal after the beaver and after the horse. Comes before the pegasus if present.",
        "cap": 4,
        "type": "Progression, Water"
    },
    "turtle": {
        "name": "Turtle", 
        "description": "Protects against otter attacks at the cost of its life.",
        "cap": 2,
        "type": "Protective"
    },
    "otter": {
        "name": "Otter", 
        "description": "Eats all cod, salmon, ducks, and beaver.",
        "cap": "none",
        "type": "Predator"
    },
    "frog": {
        "name": "Frog", 
        "description": "Comes after an otter attack. Spent when trading up water animals when having 1 too little.",
        "cap": "none",
        "type": "Buffing, Generating"
    },
    "alpaca": {
        "name": "Alpaca", 
        "description": "Used to reroll 1 of the breeding dice.",
        "cap": 1,
        "type": "Buffing"
    },
    "milk": {
        "name": "Milk", 
        "description": "Produced at the start of the turn. 1 is produced for every cow up to a maximum of 4 per turn.",
        "cap": 4,
        "type": "Resource"
    },
    "cheese": {
        "name": "Cheese", 
        "description": "Used to buy mice.",
        "cap": "none",
        "type": "Tradable"
    },
    "cheddar": {
        "name": "Cheddar", 
        "description": "Can be traded for a sheep.",
        "cap": "none",
        "type": "Tradable"
    },
    "brie": {
        "name": "Brie", 
        "description": "Increases breeding yields by 1.",
        "cap": 1,
        "type": "Buffing"
    },
    "blueCheese": {
        "name": "Blue Cheese", 
        "description": "In multiplayer: can be used to make another player lose a turn. In singleplayer: protects against 1 predator attack.",
        "cap": 1,
        "type": "Offensive, Protective"
    },
    "gouda": {
        "name": "Gouda", 
        "description": "Triggers breeding of the smallest animal whose breeding has not been triggered during breeding.",
        "cap": 1,
        "type": "Buffing"
    },
    "mouse": {
        "name": "Mouse", 
        "description": "Increases milk cap by 1.",
        "cap": 4,
        "type": "Buffing"
    },
    "snowFox": {
        "name": "Snow Fox", 
        "description": "Replaces the fox. Acts like a fox and freezes chickens and rabbits, preventing them from breeding even when not eaten.",
        "cap": "none",
        "type": "Predator"
    },
    "iceWolf": {
        "name": "Ice Wolf", 
        "description": "Replaces the wolf. Acts like a fox and freezes sheep, pigs, and cows, preventing them from breeding even when not eaten.",
        "cap": "none",
        "type": "Predator"
    },
    "seal": {
        "name": "Seal", 
        "description": "Replaces the fox. Acts like an otter and freezes cod, salmon, ducks, and beavers, preventing them from breeding even when not eaten.",
        "cap": "none",
        "type": "Predator"
    },
    "phoenix": {
        "name": "Phoenix", 
        "description": "Protects against freezing at the cost of its life.",
        "cap": "none",
        "type": "Protective"
    },
    "coop": {
        "name": "Coop", 
        "description": "Triggers chicken breeding every turn. Increases chicken cap to 40. Removes chickens from the breeding dice.",
        "cap": 1,
        "type": "Structure, Generating"
    },
    "wood": {
        "name": "Wood", 
        "description": "Crafting material used for building the coop.",
        "cap": "none",
        "type": "Material"
    },
    "ufo": {
        "name": "UFO", 
        "description": "Arrives after tribute. Makes the player select 3 random animals. If wolf is selected, it is sent to that player's farm. If not, the player may get animals according to the following: if 3 of the same are chosen, receive 2 of them; if 2 of the same and 1 different are chosen, receive nothing; if 3 different are chosen, receive the most valuable.",
        "cap": "none",
        "type": "none"
    },
}

function renderAnimalInstructions() {
    let buttonSize = width/20;
    ctx.font = String(buttonSize/2) + "px pixel";
    ctx.fillStyle = "rgb(255, 255, 0)";
    imageButton("arrowFlip", 0, 0, buttonSize, buttonSize, () => {
        state = "instructionChapter";
        renderBackground();
        renderInstructionChapter();
    }, "arrowHoverFlip");
    image(currentAnimalInstruction, width-buttonSize*3, 0, buttonSize*3, buttonSize*3);
    let name = animalInstructions[currentAnimalInstruction].name;
    let cap = "cap: "+String(animalInstructions[currentAnimalInstruction].cap);
    let type = "type: "+String(animalInstructions[currentAnimalInstruction].type);
    ctx.fillText(name, buttonSize*3, buttonSize*7/4);
    ctx.font = String(buttonSize/3) + "px pixel";
    let textArr = animalInstructions[currentAnimalInstruction].description.split(" ");
    let lineArr = [""];
    while (textArr.length > 0) {
        let line = "";
        while (ctx.measureText(line+textArr[0]).width < width-buttonSize*6 && textArr.length > 0) {
            line += textArr.shift() + " ";
        }
        lineArr.push(line);
    }
    let startX = buttonSize*3;
    let startY = buttonSize*3;
    let indexY = 0;
    for (let line of lineArr) {
        ctx.fillText(line, startX, startY+buttonSize*indexY/2);
        indexY++;
    }
    ctx.font = String(buttonSize/4) + "px pixel";
    textArr = cap.split(" ");
    lineArr = [];
    while (textArr.length > 0) {
        let line = "";
        while (ctx.measureText(line+textArr[0]).width < buttonSize*3 && textArr.length > 0) {
            line += textArr.shift() + " ";
        }
        lineArr.push(line);
    }
    textArr = type.split(" ");
    while (textArr.length > 0) {
        let line = "";
        while (ctx.measureText(line+textArr[0]).width < buttonSize*3 && textArr.length > 0) {
            line += textArr.shift() + " ";
        }
        lineArr.push(line);
    }
    startX = width-buttonSize*3;
    startY = buttonSize*3.25;
    indexY = 0;
    for (let line of lineArr) {
        ctx.fillText(line, startX, startY+buttonSize*indexY/3);
        indexY++;
    }
}

function renderMenu() {
    ctx.font = "1px pixel";
    ctx.font = String(width/3/ctx.measureText("SuperFarmer").width)+"px pixel";
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 2;
    ctx.fillText("SuperFarmer", width/2-ctx.measureText("SuperFarmer").width/2, ctx.measureText("M").width);
    ctx.strokeText("SuperFarmer", width/2-ctx.measureText("SuperFarmer").width/2, ctx.measureText("M").width);
    ctx.font = "1px pixel";
    ctx.font = String(width/9/ctx.measureText("Start").width)+"px pixel";
    textButton("Start", width/2-ctx.measureText("Start").width/2, height/2-ctx.measureText("M").width/2, "rgb(0, 127, 0)", () => {
        state = "selectPlayers";
        renderBackground();
        renderSelectPlayers();
    });
    textButton("Instructions", width/2-ctx.measureText("Instructions").width/2, height/2+ctx.measureText("M").width/2, "rgb(0, 127, 0)", () => {
        state = "instructions";
        renderBackground();
        renderInstructions();
    });
}

function renderMenuMobile() {
    ctx.font = "1px pixel";
    ctx.font = String(width/ctx.measureText("SuperFarmer").width)+"px pixel";
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 2;
    ctx.fillText("SuperFarmer", width/2-ctx.measureText("SuperFarmer").width/2, ctx.measureText("M").width);
    ctx.strokeText("SuperFarmer", width/2-ctx.measureText("SuperFarmer").width/2, ctx.measureText("M").width);
    ctx.font = "1px pixel";
    ctx.font = String(width/3/ctx.measureText("Start").width)+"px pixel";
    ctx.fillText("Start", width/2-ctx.measureText("Start").width/2, height/2-ctx.measureText("M").width/2);
    ctx.strokeText("Start", width/2-ctx.measureText("Start").width/2, height/2-ctx.measureText("M").width/2);
    canvas.addEventListener("click", (e) => {
        removeListeners();
        state = "selectPlayers";
        renderBackground();
        renderSelectPlayersMobile();
    })
}

async function start() {
    await loadImages();
    ctx.font = "1px pixel";
    document.fonts.add(new FontFace("pixel", "./fonts/PublicPixel.ttf"));
    await document.fonts.load("1px pixel");
    renderBackground();
    width >= height ? renderMenu() : renderMobileNo();
}

start();

function renderMobileNo() {
    let text = "This game is not available on mobile (yet). Sorry!";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = "1px pixel";
    ctx.font = String(width/ctx.measureText(text).width)+"px pixel";
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.lineWidth = 2;
    ctx.fillText(text, width/2-ctx.measureText(text).width/2, height/2-ctx.measureText("M").width/2);
}

addEventListener("resize", async function() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.setAttribute("width", window.innerWidth);
    canvas.setAttribute("height", window.innerHeight);
    let canvasCopy = canvas.cloneNode(false);
    document.body.replaceChild(canvasCopy, canvas);
    canvas = canvasCopy;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.font = "1px pixel";
    ctx.lineWidth = 2;
    await document.fonts.load("1px pixel");
    if (width >= height) {
        switch (state) {
            case "menu":
                renderBackground();
                renderMenu();
                break;
            case "instructions":
                renderBackground();
                renderInstructions();
                break;
            case "instructionChapter":
                renderBackground();
                renderInstructionChapter();
                break;
            case "animalInstructions":
                renderBackground();
                renderAnimalInstructions();
                break;
            case "selectPlayers":
                renderBackground();
                renderSelectPlayers();
                break;
            case "addons":
                renderBackground();
                renderChooseAddons();
                break;
            case "game":
                renderBackground();
                renderGame();
                break;
            case "end":
                renderBackground();
                renderEnd();
                break;
        }
    } else {
        renderBackground();
        renderMobileNo();
    }
});