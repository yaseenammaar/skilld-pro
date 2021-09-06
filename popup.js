let selectedQueries = new Set();
let totalNum = 0;

// var popupWindow = window.open(
//     chrome.extension.getURL("popup.html"),
//     "exampleName",
//     "width=400,height=400"
// );




$(".follow").click(function(){
    let query = $(".follow-query").val().replace(/ /g,'');
    query = encodeURIComponent(query);
    let people = $(".follow-select").val();
    // validate input here man
    localStorage.setItem("all", 0);

    // url: `https://www.instagram.com/explore/people/suggested/#startfollow${people}&name=${query}`
    chrome.tabs.create({
        url: `https://www.instagram.com/${query}?startfollow&num=${people}`
    })
})


$(".all").click(function(){
    let query = $(".follow-query-all").val().replace(/ /g,'');
    query = encodeURIComponent(query);
    let people = $(".follow-select").val();
    let msg = $('.msg-query').val()


    chrome.tabs.create({
        url: `https://www.instagram.com/${query}?startall&num=${people}&all=1&msg=${msg}&u=${query}`
    })
})

chrome.runtime.sendMessage({type: GET_TEMP_COMMENT}, (res)=>{
    if(res && res.tempComment) $(".comment-text").val(res.tempComment);
})

chrome.runtime.sendMessage({type: GET_MESSAGE}, (res)=>{
    if(res && res.message) $(".messenger-text").val(res.message);
})

chrome.storage.local.get(FOLLOW_IDS_KEY, (res)=>{
    if(res && res[FOLLOW_IDS_KEY]){
        let followIds = res[FOLLOW_IDS_KEY];
        if(!followIds) followIds = {};
        let queries = Object.keys(followIds);
        let queriesHTML = queries.map(query=>{
            // return `<div class="tag is-medium">${query}</div>`
            return `<button ref-query="${query}" class="button is-outlined">${query} <div class="tag ml-3">${followIds[query].length}</div></button>`
        });
        // document.querySelector(".queries").innerHTML = queriesHTML.join(" ");
    }
})



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


chrome.storage.local.get(['userIds'], function(result) {
     console.log(result)
});



chrome.storage.sync.get(ACTIVITY_TRACK, (resp) => {
    let activites = resp[ACTIVITY_TRACK];
    if(!activites || activites.date != getToday()){
        activites = newActivity();
        chrome.storage.sync.set({[ACTIVITY_TRACK]: activites});
    }
    // $(".follow-use").text(`${localStorage.getItem('userIds')}`)

    $(".follow-use").text(`${activites[ACTIVITY_NAMES.FOLLOWS]}/150`)
    $(".tweet-use").text(`${activites[ACTIVITY_NAMES.TWEETS]}/150`)
    $(".messages-use").text(`${activites[ACTIVITY_NAMES.MESSAGES]}/150`)
})



$(document).on("click", ".queries .button", function(){
    let tag = $(this).find(".tag");
    let query = $(this).attr("ref-query");

    if(tag.hasClass("is-link")){
        tag.removeClass("is-link");
        selectedQueries.delete(query);
        totalNum -= parseInt(tag.text());
    }else{
        tag.addClass("is-link");
        selectedQueries.add(query);
        totalNum += parseInt(tag.text());
    }
    $(".totalnum").text(totalNum);
})

$("#msg").click(function(){
    let message = $(".messenger-text").val();
    let num = $(".dm-select").val();
    let q = $(".dm-query").val();

    chrome.runtime.sendMessage({type: SET_MESSAGE, message});
    chrome.runtime.sendMessage({type: SEND_MESSAGES, selectedQueries: [...selectedQueries]});

    chrome.tabs.create({
        url:   `https://www.instagram.com/${q}/?startinbox&msg=${message}&num=${num}&uname=${q}`
    })

    // chrome.tabs.create({
    //     url:   `https://www.instagram.com/direct/inbox/#startinbox&msg=${message}&num=${num}&startfrom=0`
    // })
    localStorage.setItem("all", 0);
})

$(".comment").click(function(){
    let query = $(".like-query").val();
    query = encodeURIComponent(query);
    let people = $(".comment-select").val();
    let comment = $(".comment-text").val();
    chrome.runtime.sendMessage({type: SET_TEMP_COMMENT, tempComment: comment});
    localStorage.setItem("all", 0);

    chrome.tabs.create({
        url:   `https://www.instagram.com/${query}?startlike&num=${people}`
    })
})

$("[ref-tab]").click(function(e){
    let target =  $(e.target).parent();
    let ref = target.attr("ref-tab");
    $("[ref-tab]").removeClass("is-active");
    target.addClass("is-active");
    $(".tab-item").hide();
    $(`#${ref}`).show();
})

// console.log(localStorage.getItem('userIds'))

document.getElementsByClassName('follow-use')[0].innerText = localStorage.getItem('userIds')+'/150';