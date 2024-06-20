const loader = document.getElementById("loader");

const clearButton = document.getElementById('clearButton');
const submitButton = document.getElementById('submitButton');

const bodyButton = document.getElementById('bodyButton');
const earsButton = document.getElementById('earsButton');
const eyesButton = document.getElementById('eyesButton');
const snoutButton = document.getElementById('snoutButton');
const backgroundButton = document.getElementById('backgroundButton');

const whiteColors = ["white"];
const defaultColors = ["#e8e8e8", "#dbb288", "#be884f", "#7f5735", "#5d3719"];
const backgroundColors = ["#f6f6f6", "#f3e7de", "#e1d6c9", "#d6d1c8", "#d4c6c1", "#c3afa7"];

const colors = document.getElementById('colors');
const options = document.getElementById('options');

const createAvatar = document.getElementById('createAvatar');
const downloadPhotoScreen = document.getElementById('downloadPhoto');
const photo = document.getElementById('photo');
const downloadButton = document.getElementById('downloadButton');
const backButton = document.getElementById('backButton');

let currentBodyOption = 1;
let currentBodyColor = 1;
let currentEarsOption = 1;
let currentEarsColor = 1;
let currentEyesOption = 1;
let currentSnoutOption = 2;
let currentBackgroundOption = 1;
let currentColor = 2;

window.addEventListener("load", function () {
    loader.classList.remove("show");
    loader.classList.add("hide");
    createAvatar.classList.remove("hide");
    createAvatar.classList.add("show");
});

clearButton.onclick = clear;
submitButton.onclick = submit;

bodyButton.onclick = function() {
    seeOptions("body", 1, defaultColors.length);
    changeColorButtons(defaultColors, defaultColors.length);
};
earsButton.onclick = function() {
    seeOptions("ears", 8, defaultColors.length);
    changeColorButtons(defaultColors, defaultColors.length);
};
eyesButton.onclick = function() {
    seeOptions("eyes", 5, whiteColors.length);
    changeColorButtons(whiteColors, whiteColors.length);
};
snoutButton.onclick = function() {
    seeOptions("snout", 10, whiteColors.length);
    changeColorButtons(whiteColors, whiteColors.length);
};
backgroundButton.onclick = function() {
    seeOptions("background", 3, backgroundColors.length);
    changeColorButtons(backgroundColors, backgroundColors.length);
};

downloadButton.onclick = download;
backButton.onclick = back;

let currentButton;
for (let i = 1; i <= 5; i++) {
    currentButton = document.getElementById(`color-${i}`);
    currentButton.onclick = function() {changeColor("body", getCurrentPartOption("body"), i)};
}

function getCurrentPartOption(part) {
    switch(part) {
        case "body":
            return currentBodyOption;
        case "ears":
            return currentEarsOption;
        case "eyes":
            return currentEyesOption;
        case "snout":
            return currentSnoutOption;
        default:
            return currentBackgroundOption;
    }
}

function clear() {
    changeColor("body", 1, 1);
    changeColor("ears", 1, 1);
    changeColor("eyes", 1);
    changeColor("snout", 4);
    changeColor("background", 1, 2);
}

function submit() {
    createAvatar.classList.remove("show");
    createAvatar.classList.add("hide");
    downloadPhotoScreen.classList.remove("hide");
    downloadPhotoScreen.classList.add("show");
    mergeImages(photo, 300, 300);
}

function mergeImages(canvas, width, height) {
    let ctx = canvas.getContext("2d");
    let images = document.querySelectorAll(".canvas [data-cell] img");
    images.forEach(img => {
        if (img.src.includes("background")) {
            ctx.drawImage(img, 0, 0, width, height);
        } else {
            // Shift elements on the canvas downwards by 15px
            ctx.drawImage(img, 0, 15, width, height);
        }
    })
}

function seeOptions(part, optionsMax, colorsMax) {
    // Add option buttons
    options.innerHTML = 
        `<button class="option" id="option-1">
            <img src="src/icons/${part}-icon-1.png">
        </button>`;
    for (let i = 2; i <= optionsMax; i++) {
        options.innerHTML += 
            `<button class="option" id="option-${i}">
                <img src="src/icons/${part}-icon-${i}.png">
            </button>`;
    }

    // Add color buttons
    colors.innerHTML =
        `<button class="color" id="color-1"></button>`;
    for (let i = 2; i <= colorsMax; i++) {
        colors.innerHTML += 
            `<button class="color" id="color-${i}"></button>`;
    }
    if (colorsMax > 5) {
        new SimpleBar(colors);
    }

    // Change option button onclick
    let currentButton;
    for (let i = 1; i <= optionsMax; i++) {
        currentButton = document.getElementById(`option-${i}`);
        currentButton.onclick = function() {changeColor(part, i, currentColor)};
    }

    // Change color button onclick
    for (let i = 1; i <= colorsMax; i++) {
        currentButton = document.getElementById(`color-${i}`);
        currentButton.onclick = function() {changeColor(part, getCurrentPartOption(part), i)};
    }
}

function changeColorButtons(colors, colorsMax) {
    for (let i = 1; i <= colorsMax; i++) {
        currentButton = document.getElementById(`color-${i}`);
        currentButton.style.backgroundColor = colors[i - 1];
    }
}

function changeColor(part, num, colorNum) {
    const partElement = document.getElementById(`${part}`);
    if (["body", "ears"].includes(part)) {
        partElement.innerHTML = `<img src="src/canvas/${part}-${num}-${colorNum}.png">`;
        partElement.innerHTML += `<img src="src/canvas/${part}-${num}.png">`;   
    } else if (part === "background") {
        partElement.innerHTML = `<img src="src/canvas/background-color-${colorNum}.png">`;
        partElement.innerHTML += `<img src="src/canvas/${part}-pattern-${num}.png">`;  
    } 
    else {
        partElement.innerHTML = `<img src="src/canvas/${part}-${num}.png">`;  
    }
    switch(part) {
        case "body":
            currentBodyOption = num;
        case "ears":
            currentEarsOption = num;
        case "eyes":
            currentEyesOption = num;
        case "snout":
            currentSnoutOption = num;
        default:
            currentBackgroundOption = num;
    }
    currentColor = colorNum;
}

async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'critter-creator-image'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function download() {
    const imgUrl = photo.toDataURL("image/png");
    downloadImage(imgUrl);
}

function back() {
    createAvatar.classList.remove("hide");
    createAvatar.classList.add("show");
    downloadPhotoScreen.classList.remove("show");
    downloadPhotoScreen.classList.add("hide");
    console.log(createAvatar.classList);
    console.log(downloadPhotoScreen.classList);
}
