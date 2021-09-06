let RE = /.*:\/\/.*twitter.com\/[a-z1-9_]+\/followers/;
let followPage = false;
let ids;
let ptr = 0;
let user; // needs to be persisted
let tempComment = "";
let messagingTab;
let message;
let activities = newActivity();

function getToday() {
    let ndate = new Date();
    return `${ndate.getFullYear()}-${ndate.getMonth()}-${ndate.getDate()}`;
}

function newActivity() {
    return {
        follows: 0,
        messages: 0,
        tweets: 0,
        date: getToday()
    }
}

function hasHitCap(activityName) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(ACTIVITY_TRACK, (resp) => {
            let ac = resp[ACTIVITY_TRACK];
            if (ac && ac[activityName] >= 150) {
                resolve(true);
                return;
            }
            resolve(false);
        })
    })
}

chrome.storage.sync.get(ACTIVITY_TRACK, (resp) => {
    if (resp[ACTIVITY_TRACK]) activities = resp[ACTIVITY_TRACK];
})

function updateActivity(activityName) {
    chrome.storage.sync.get(ACTIVITY_TRACK, (resp) => {
        let ac = resp[ACTIVITY_TRACK];
        if (ac) {
            activities = ac;
            if (ac.date != getToday()) {
                activities = newActivity();
            }
        }
        activities[activityName]++;
        chrome.storage.sync.set({ [ACTIVITY_TRACK]: activities });
    })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.url) return;
    if (RE.test(tab.url)) {
        followPage = true;
    } else followPage = false;
})

chrome.storage.local.get(USER_ID_KEY, (res) => {
    if (res && res[USER_ID_KEY]) user = res[USER_ID_KEY];
})

function urlGen(id, me) {
    return `https://twitter.com/messages/${id}-${me}#start`;
}

let messagingCapAlert = false;

async function startMessaging(_isnew) {
    let messagingCapHit = await hasHitCap(ACTIVITY_NAMES.MESSAGES);
    if(messagingCapHit){
        if(!messagingCapAlert) alert("You've reached maximum messages per day!");
        messagingCapAlert = true;
        return;
    }
    if (!ids || !user) return;
    if (ptr >= ids.length) {
        alert("done sending messages!");
        return;
    }
    let urlObject = { url: urlGen(ids[ptr++], user) };
    if (_isnew) {
        chrome.tabs.create(urlObject, (tab) => {
            messagingTab = tab;
        });
    } else {
        chrome.tabs.update(messagingTab.id, urlObject);
    }
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.type === GET_STATE) {
        response({ state: followPage });
    } else if (request.type === SEND_MESSAGES) {
        let queries = request.selectedQueries;
        ids = [];
        chrome.storage.local.get(FOLLOW_IDS_KEY, (res) => {
            if (res && res[FOLLOW_IDS_KEY]) {
                let followIds = res[FOLLOW_IDS_KEY];
                if (!followIds) followIds = {};
                for (const q of queries) {
                    if (!followIds[q]) continue;
                    ids = [...ids, ...followIds[q]];
                }
                ptr = 0;
                startMessaging(true);
            }
        })
    } else if (request.type === SEND_USER_ID) {
        user = request.id;
        chrome.storage.local.set({ [USER_ID_KEY]: user });
    } else if (request.type === NEXT_PERSON) {
        startMessaging(false);
    } else if (request.type === SET_MESSAGE) {
        chrome.storage.local.set({ [SET_MESSAGE]: request.message });
    } else if (request.type === GET_MESSAGE) {
        chrome.storage.local.get(SET_MESSAGE, (res) => {
            let message = res[SET_MESSAGE];
            response({ message });
        })
    } else if (request.type === SEND_FOLLOW_ID) {
        // store ids
        let id = request.id;
        let query = `${request.query}`.trim();
        chrome.storage.local.get(FOLLOW_IDS_KEY, (res) => {
            if (!res) return;
            let followIds = res[FOLLOW_IDS_KEY];
            if (!followIds) followIds = {};
            if (followIds[query]) {
                let uniqueIds = new Set([...followIds[query], id]);
                followIds[query] = [...uniqueIds];
            } else {
                followIds[query] = [id];
            }
            chrome.storage.local.set({ [FOLLOW_IDS_KEY]: followIds });
        })
    } else if (request.type === GET_TEMP_COMMENT) {
        response({ tempComment });
    } else if (request.type === SET_TEMP_COMMENT) {
        tempComment = request.tempComment;
    } else if (request.type === UPDATE_ACTIVITY) {
        updateActivity(request.activityName);
    } else if (request.type === CHECK_CAP) {
        hasHitCap(request.activityName)
        .then(_=>response(_))
        .catch(_=>response(true));
    }
    return true;
})