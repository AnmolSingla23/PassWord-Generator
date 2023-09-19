const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseChk = document.querySelector("#uppercase");
const lowercaseChk = document.querySelector("#lowercase");
const numbersChk = document.querySelector("#numbers");
const symbolChk = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allChkBox = document.querySelectorAll("input[type=checkbox]");

//we are creating this string to generate random symbols as ascii value is not countinuous
const symbols = "~`!#@$%^&*()_+-=|\}]{[:;<,'>.?/"

let password = "";
let passwordLength = 10;
let chkcount = 0;
//set strength circle color to grey
setIndicator("#ccc");


//set passwords length
handleSlider();
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = (passwordLength - min) * 100 / (max - min) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //set shadow later
    indicator.style.boxShadow = `0px 0px 10px 1px ${color}`;
}

//function to generate a random number using this formula
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//to select a random number from range 0 to 9
function generateRandomNumber() {
    return getRandom(0, 10);
}

//to generate a lower case letter if chk box selected
function generatelower() {
    return String.fromCharCode(getRandom(97, 123));  //ascii value
}

//to generate uppercase letter
function generateupper() {
    return String.fromCharCode(getRandom(65, 91));
}

//to generate special characters
function generatesymbol() {
    const randNum = getRandom(0, symbols.length);
    return symbols.charAt(randNum);
}

function calStrength() {
    let hasupper = false;
    let haslower = false;
    let hasnum = false;
    let hassym = false;

    if (uppercaseChk.checked) hasupper = true;
    if (symbolChk.checked) hassym = true;
    if (numbersChk.checked) hasnum = true;
    if (lowercaseChk.checked) haslower = true;

    if (haslower && hasupper && (hasnum || hassym) && passwordLength >= 10) {
        setIndicator("#0f0");
    } else if ((haslower || hasupper) && (hasnum || hassym) && passwordLength >= 7) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML = "Copied";
    }
    catch (e) {
        copyMsg.innerHTML = "Failed";
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 3000);

}

function handleCheckBoxChange() {
    chkcount = 0;
    allChkBox.forEach((checkbox) => {
        if (checkbox.checked)
            chkcount++;
    })
}

allChkBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

//shuffle the password
function shuffle(array) {
    //use a algorithm named fisher yates
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((i) => (str += i));
    return str;
}

generateBtn.addEventListener('click', () => {

    //base case whn no chkbox checked
    if (chkcount <= 0) return;

    password = "";

    //chk which chkboxes are checked

    let funcArr = [];

    if (uppercaseChk.checked) {
        funcArr.push(generateupper);
    }
    if (lowercaseChk.checked) {
        funcArr.push(generatelower);
    }

    if (numbersChk.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolChk.checked) {
        funcArr.push(generatesymbol);
    }

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    //remainig
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIdx = getRandom(0, funcArr.length);
        password += funcArr[randIdx]();
    }

    //shuffle the password
    password = shuffle(Array.from(password));

    //display the password
    passwordDisplay.value = password;

    //calculate the strength
    calStrength();
});