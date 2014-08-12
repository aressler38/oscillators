define(function () { 
    if (!window.AudioContext && !window.webkitAudioContext) {
        alert("Your browser doesn't support the WebAudio standard." +
            " Maybe you need to activate it in your settings/flags.");
        return 1;
    }
    else {
        var ctx = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext() ;
        return ( ctx );
    }
});
