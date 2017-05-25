var backEventListener = null;

//var score = window.localStorage.getItem('score');
var mistake = window.localStorage.getItem('mistake');

//(function () {
  //  var localVar = 
    //console.log(localVar);
//})();
var unregister = function() {
    if (backEventListener !== null) {
        document.removeEventListener('tizenhwkey', backEventListener);
        backEventListener = null;
        window.tizen.application.getCurrentApplication().exit();
    }
}
var init = function() {
    // register once 
    if (backEventListener !== null) {
        return;
    }

    // TODO:: Do your initialization job 
    console.log("init() called");

    var backEvent = function(e) {
        if (e.keyName == "back") {
            try {
                if ($.mobile.urlHistory.activeIndex <= 0) {
                    // if first page, terminate app 
                    unregister();
                } else {
                    // move previous page 
                    $.mobile.urlHistory.activeIndex -= 1;
                    $.mobile.urlHistory.clearForward();
                    window.history.back();
                }
            } catch (ex) {
                unregister();
            }
        }
    }    
    $(document).ready(showResults());
    // add eventListener for tizenhwkey (Back Button) 
    document.addEventListener('tizenhwkey', backEvent);
    backEventListener = backEvent;
};

function showResults(){
	console.log(mistake);
	if (mistake<=2) {
		$('#pass').text("ТЕСТ ПРОЙДЕН");
		$('#pass').css('color', 'green');
	}
	$('#scores').text(mistake);
}
$(document).bind('pageinit', init);
$(document).unload(unregister);

