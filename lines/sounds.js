//var tracks = document.getElementById("sounds").audioTracks;
var airSound = new Audio("audio/272018__aldenroth2__blowing-air.wav");
var waterSound = new Audio("audio/398706__inspectorj__water-swirl-small-13.wav");
function playByString(str){
    if (localStorage.getItem("sound") == "false") return;
    switch (str){
        case "HH":
        case "OO":
        case "OCO":
        case "CO":
        case "OC":
            airSound.play();
            break;
        case "HOH":
            waterSound.play();
            break;
    }
}