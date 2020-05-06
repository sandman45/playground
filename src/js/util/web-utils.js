function checkCookie(){
    var cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled){
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie")!=-1;
    }
    return cookieEnabled || showCookieFail();
}

function showCookieFail(){
    // do something here
    // alert('Show Cookie Failed');
    console.log('Show Cookie Failed');
}


// within a window load,dom ready or something like that place your:
const cookie = checkCookie();

// alert(`Cookies Enabled: ${cookie}`);
console.log(`Cookies Enabled: ${cookie}`);
