let message = "Hello welcome to my hun";
let done = false;

chrome.runtime.sendMessage({ type: GET_MESSAGE }, (res) => {
    if (res) {
        message = res.message;
    }
})


function delayy(val) {
    if (!val) val = 1000;
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve(true);
        }, 1000);
    })
}

function copyHere(text) {
    let input = document.createElement("input");
    input.id = "mycopy-input";
    document.body.append(input);
    let inp = document.querySelector("#mycopy-input");
    inp.value = text;
    inp.select();
    document.execCommand("copy");
    inp.remove();
}

async function work() {
    let input = document.querySelector(".DraftEditor-root");
    if (!input) return;
    copyHere(message);
    let chatbox = input.querySelector("[contenteditable]");
    chatbox.focus();
    document.execCommand("paste");
    document.querySelector("[aria-label='Send']").click();
    chrome.runtime.sendMessage({type: UPDATE_ACTIVITY, activityName: ACTIVITY_NAMES.MESSAGES});
    // get out of here
    done = true;
    await delayy(2000);
    chrome.runtime.sendMessage({ type: NEXT_PERSON });
}



let intv;
let c = 0;
intv = setInterval(function () {
    if (window.location.hash !== "#start") {
        clearInterval(intv);
        done = true;
    }
    if (c >= 2 && !done) {
        chrome.runtime.sendMessage({ type: NEXT_PERSON });
    }
    if (done) {
        clearInterval(intv);
        return;
    }
    work();
    c++;
}, 4000)
