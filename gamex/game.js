activeTriangle = -1;
Label({title : "User " + userId, x : 100, y : 120, color : "red"});
Label({title : "World " + world, x : 100, y : 140, color : "blue"});
Label({title : "Username " + username, x : 100, y : 160, color : "green"});
gameInfo = PostCommonParsed(JSON.stringify({action : "load", id : world}), "worlds.php").message[0];
if (!world) alert("unath?");
//gameInfo = JSON.parse(gameInfo);
Label({title : "Planet " + gameInfo.planet, x : 100, y : 200, color : "blue"});
Label({title : "Name planet " + gameInfo.name, x : 100, y : 220, color : "blue"});
//Label({title : "Data " + gameInfo.data, x : 100, y : 240, color : "blue"});
Label({title : "Start " + gameInfo.starttime, x : 100, y : 260, color : "blue"});
var activeTileText = new Label({title : "test", x : 100, y : 350, color : "green"});
var activeUnitsList = new Label({title : "no selected", x : 100, y : 400, color : "green"});
function getUnitsByTri(){
    var label = "";
    units.forEach(function(element){
        if (element.tileId == activeTriangle)
            label += element.toString();
    });
    return label;
}