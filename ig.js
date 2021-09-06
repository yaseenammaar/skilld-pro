function delayy(val) {
    // if (!val) val = 1000;
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve(true);
        }, val);
    })
}

const addNSecondsDelay = (n) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, n * 1000);
  });
}

function checkCap(activityName) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: CHECK_CAP, activityName }, hit => {
            resolve(hit);
        })
    })
}


let initCount = 2000;
setTimeout(() => {
    // getUserId();
    initCount += initCount;
}, initCount)


let _url = window.location.href;
console.log(_url)




// if(_url.search("instagram.com/direct/inbox") > -1 && _url.search("#startinbox") > -1){

window.onload = function exampleFunction() {
  
    if(_url.search("startinbox") > -1){

        var hash = document.location.href;
        let num = hash.split('&num=')[1].split('&uname=')[0];
        let msg = hash.split('&msg=')[1].split('&num=')[0];
        let uname = hash.split('&num=')[1].split('&uname=')[1];
        console.log(hash)
        console.log(num[0])
        console.log(msg)
        console.log(uname)

        directMessage(msg,num,uname)
        
        // dm(num, msg, _url, 0);
    }
    else if (_url.search("instagram.com/") > -1 && _url.search("startlike") > -1) {

        let hash = window.location.href;
        let num = hash.split('&num=')[1]

        likePosts(num);
    }else if(_url.search("instagram.com/") > -1 && _url.search("startfollow") > -1){
        let hash = window.location.href;
        let num = hash.split('&num=')[1]
        startFollow(num);
    }else if(_url.search("instagram.com/") > -1 && _url.search("likethisone") > -1){
        likeone();
    }else if(_url.search("instagram.com/") > -1 && _url.search("startsendinbox") > -1){
        var hash = document.location.href;
        let num = hash.split('&num=')[1].split('&uname=')[0];
        let msg = hash.split('&msg=')[1].split('&num=')[0];
        directMessageSend(msg,num);
    }

    if(_url.search("instagram.com/") > -1 && _url.search("likeAndClose") > -1){

        likeAndClose();

        
    }
    if(_url.search("instagram.com/") > -1 && _url.search("startall") > -1){

       
            let hash = window.location.href;
            let num = hash.split('&num=')[1].split('&all=1')[0];
            let u = hash.split('&u=')[1];
            let msg = hash.split('&msg=')[1].split('&u=')[0];
            console.log(hash)
            console.log(num)
            console.log(u)
            console.log(msg)
            performAll(u, num, msg);
        
        


        
    }



}


async function performAll(u, num, msg){

        let followCapa = await checkCap(ACTIVITY_NAMES.FOLLOWS);
        let likeCapa = await checkCap(ACTIVITY_NAMES.TWEETS);
        let msgCapa = await checkCap(ACTIVITY_NAMES.MESSAGES);
        if(followCapa || msgCapa || likeCapa){
            alert('Your Daily limit of Follow, DM or Likes has been reached. You can still use them seperately.')
        }else{
            numb = num
            var links =[]


            try{
                await addNSecondsDelay(3);
                document.getElementsByTagName('a')[0].click()
                await addNSecondsDelay(5);
                const El = document.getElementsByClassName('isgrP')[0];
                var lll = document.getElementsByClassName('PZuss')[0].children
                console.log('Start Follow: In Function')
                for(let i=0;i<numb;i++){
                    try{
                        if(lll[i].getElementsByClassName('sqdOP L3NKy y3zKF')[0].innerText == "Follow"){
                            lll[i].getElementsByClassName('sqdOP L3NKy y3zKF')[0].click()
                            links.push(lll[i].getElementsByClassName('FPmhX notranslate _0imsa')[0].href)
                            chrome.runtime.sendMessage({ type: UPDATE_ACTIVITY, activityName: ACTIVITY_NAMES.FOLLOWS });
                        }else{

                        }
                        await addNSecondsDelay(32);
                        El.scrollTo({top: i*30, behavior: 'smooth'});
                        lll = document.getElementsByClassName('PZuss')[0].children
                    }catch(e){
                        console.log(e)
                        numb++;
                    }
                }

                console.log('Links', links)

                var n = 0

                if(links.length>num){
                    n = num
                }else{
                    n = links.length
                }
                console.log('n = ', n)


                console.log('links.length',links.length)
                console.log('num',num)

                for(let i=0;i<n;i++){
                    console.log("Links", links[i])
                    var nn = window.open(links[i]+'?likeAndClose');
                    await addNSecondsDelay(17);
                }


                var uarray = []

                for(let j=0;j<links.length;j++){
                    var a = links[j].split('/')[3]
                    console.log('links', a)
                    uarray.push(a)
                }
                localStorage.setItem('userstodm', uarray)
                window.location.replace('https://www.instagram.com/direct/inbox/#startsendinbox&msg='+msg+'&num='+num);

            }catch(e){
                console.log(e)
                // performAll(num)
            }
        }
    

    //Following

   
}







async function likeAndClose(){

        console.log('we again')
        await addNSecondsDelay(5);
        console.log('we again 2')
        // document.getElementsByTagName('a')[6].click()
        try{
            if(document.getElementsByClassName('v1Nh3 kIKUG  _bz0w')[0].children[0]){
                 document.getElementsByClassName('v1Nh3 kIKUG  _bz0w')[0].children[0].click()
                await addNSecondsDelay(5);
                document.getElementsByClassName('ltpMr  Slqrh')[0].children[0].children[0].click()
                chrome.runtime.sendMessage({ type: UPDATE_ACTIVITY, activityName: ACTIVITY_NAMES.TWEETS });
            }
            await addNSecondsDelay(5);
        }catch(e){
            close()
        }
        close()
}

async function startFollow(num){
     let followCap = await checkCap(ACTIVITY_NAMES.FOLLOWS);

    if(followCap){
        alert('Follow: Daily Limit Reached')
    }else{

        try{

            await addNSecondsDelay(3);
            document.getElementsByTagName('a')[0].click()
            await addNSecondsDelay(5);
            const El = document.getElementsByClassName('isgrP')[0];
            var lll = document.getElementsByClassName('PZuss')[0].children
            console.log('Start Follow: In Function')
            for(let i=0;i<num;i++){
                try{
                    document.title = "Skilldd: Follow";

                    let followCapi = await checkCap(ACTIVITY_NAMES.FOLLOWS);

                    if(followCapi){
                        alert('Follow: Daily Limit Reached')
                        i=num;
                    }else{
                        if(lll[i].getElementsByClassName('sqdOP L3NKy y3zKF')[0].innerText == "Follow"){
                            lll[i].getElementsByClassName('sqdOP L3NKy y3zKF')[0].click()
                            chrome.runtime.sendMessage({ type: UPDATE_ACTIVITY, activityName: ACTIVITY_NAMES.FOLLOWS });
                        }else{
                        }
                        await addNSecondsDelay(32);
                        El.scrollTo({top: i*30, behavior: 'smooth'});
                        lll = document.getElementsByClassName('PZuss')[0].children
                    }
                }catch(e){
                    console.log(e)
                    num++;
                }
            }
            alert('Follow : Done!')
        }catch(e){
            startFollow(num)
        }
    }
}



async function likePosts(num){
     let likecap = await checkCap(ACTIVITY_NAMES.TWEETS);
     document.title = "Skilldd: Likes";

    if(likecap){
        alert('Likes: Daily Limit Reached')
    }else{

        console.log('Here we are')
        await addNSecondsDelay(5);

        var username = 'yaseenammaar'
        document.getElementsByTagName('a')[0].click()
        await addNSecondsDelay(5);

        const El = document.getElementsByClassName('isgrP')[0];

        El.scrollTo({top: 150, behavior: 'smooth'});
        await addNSecondsDelay(5);
        El.scrollTo({top: 10000, behavior: 'smooth'});
        await addNSecondsDelay(5);
        El.scrollTo({top: 10000, behavior: 'smooth'});
        await addNSecondsDelay(5);
       

        if(num>10){
             El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
        }

        if(num>20){
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
        }
        else if(num>50){
             El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
             El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
             El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            
        }

        var userLinks = document.getElementsByClassName('FPmhX notranslate _0imsa')

        console.log('links', userLinks)

        var n = 0

        if(userLinks>num){
            n = num
        }else{
            n = userLinks.length
        }

        console.log('userLinks.length',userLinks.length)
        console.log('num',num)

        for(let i=0;i<n;i++){
            document.title = "Skilldd: Likes";

             let likecapi = await checkCap(ACTIVITY_NAMES.TWEETS);

                if(likecapi){
                    alert('Likes: Daily Limit Reached')
                }else{

                console.log(i)
                var nn = window.open(userLinks[i].href+'?likeAndClose');
                await addNSecondsDelay(17);
                chrome.runtime.sendMessage({ type: UPDATE_ACTIVITY, activityName: ACTIVITY_NAMES.TWEETS });
            }

        }

        // document.getElementsByTagName('a')[6].click()
        // await addNSecondsDelay(5);
        // document.getElementsByTagName('button')[7].click()
        alert("Likes: Done!")
    }
}




async function getUsernamesByUsername(u){

    console.log('Here we are')
    await addNSecondsDelay(5);

    var username = 'yaseenammaar'
    document.getElementsByTagName('a')[0].click()
    await addNSecondsDelay(5);
    var userLinks = document.getElementsByClassName('FPmhX notranslate _0imsa')


}




async function directMessageSend(msg,num){

    var u = localStorage.getItem('userstodm')
    var message = decodeURI(msg);
    var usernames = u.split(',')
    console.log(usernames)

    var n = 0
    if(usernames.length>num){
        n = num
    }else{
        n = usernames.length
    }
    message = message.split('&num=')[0]

    console.log(n)
    console.log(num)
    console.log(usernames.length)


    await addNSecondsDelay(5);
    for (let i = 0; i < n; i++) {
        try{
            let msgcapi = await checkCap(ACTIVITY_NAMES.MESSAGES);
            if(msgcapi){
                alert('Direct Message: Daily Limit Reached')
                i=n;
            }else{
                document.title = "Skilldd: DM";
                console.log(i)
                document.getElementsByClassName('wpO6b ZQScA ')[0].click()
                await addNSecondsDelay(5);
                var input = document.getElementsByClassName('HeuYH')[0].getElementsByTagName('input')[0]
                input.select();
                input.focus();
                document.execCommand('insertText', false, usernames[i]);
                input.dispatchEvent(new Event('change', {bubbles: true}));
                await addNSecondsDelay(6);
                document.getElementsByClassName('Igw0E rBNOH eGOV_ ybXk5 _4EzTm XfCBB HVWg4')[0].click()
                await addNSecondsDelay(6);
                document.getElementsByClassName('sqdOP yWX7d y3zKF cB_4K')[0].click()
                await addNSecondsDelay(5);
                var inputmsg = document.getElementsByClassName('Igw0E IwRSH eGOV_ vwCYk ItkAi')[0].children[0]
                inputmsg.select();
                inputmsg.focus();
                document.execCommand('insertText', false, message);
                input.dispatchEvent(new Event('change', {bubbles: true}));
                await addNSecondsDelay(4);
                document.getElementsByClassName('sqdOP yWX7d y3zKF')[3].click()
                await addNSecondsDelay(5);

                chrome.runtime.sendMessage({type: UPDATE_ACTIVITY, activityName: ACTIVITY_NAMES.MESSAGES});
            }
            
        }catch(e){
            console.log(e)
        }
    }
    alert("DM: Done!")


}




async function directMessage(msg,num,uname){
    // var usernames = ['yaseenammaar','artbid.co', 'he.hacks', 'stwpd.army', 'wollnot']

    
    // for(var i=0;i<10;i++){
    //     chrome.runtime.sendMessage({ type: UPDATE_ACTIVITY, activityName: ACTIVITY_NAMES.MESSAGES });
    //     console.log(i)
    // }
    
    let msgcap = await checkCap(ACTIVITY_NAMES.MESSAGES);

    if(msgcap){
        alert('Direct Message: Daily Limit Reached')
    }else{
        document.title = "Skilldd: DM";
         console.log('Here we are')
        await addNSecondsDelay(5);
        // var username = 'yaseenammaar'
        document.getElementsByTagName('a')[0].click()
        await addNSecondsDelay(5);

        const El = document.getElementsByClassName('isgrP')[0];

        El.scrollTo({top: 150, behavior: 'smooth'});
        await addNSecondsDelay(5);
        El.scrollTo({top: 10000, behavior: 'smooth'});
        await addNSecondsDelay(5);
        El.scrollTo({top: 10000, behavior: 'smooth'});
        await addNSecondsDelay(5);
        El.scrollTo({top: 10000, behavior: 'smooth'});
        await addNSecondsDelay(5);
        El.scrollTo({top: 10000, behavior: 'smooth'});

        if(num>10){
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
        }

        if(num>20){
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
        }
        else if(num>50){
             El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
             El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
             El.scrollTo({top: 10000, behavior: 'smooth'});
            await addNSecondsDelay(5);
            El.scrollTo({top: 10000, behavior: 'smooth'});
            
        }


        var userLinks = document.getElementsByClassName('FPmhX notranslate _0imsa')

        var uarray = []



        for(let j=0;j<userLinks.length;j++){
            var a = userLinks[j].href.split('/')[3]
            console.log('links', a)
            uarray.push(a)
        }

        console.log(uarray)

        localStorage.setItem('userstodm',uarray)

        window.location.replace('https://www.instagram.com/direct/inbox/#startsendinbox&msg='+msg+'&num='+num);

        console.log('links', userLinks)
    }

    


   
   
}


