function Label(divInfo){//x,y,caption
    var div = document.createElement("div");
    var textNode = document.createTextNode(divInfo.title);
    div.appendChild(textNode);
    div.style.position = "absolute";
    div.style.top = divInfo.y + "px";
    div.style.left = divInfo.x + "px";
    div.style.color = divInfo.color;
    div.style.zIndex = 1;
    document.body.appendChild(div);
    this.setText = function(text){
        div.textContent = text;
    };
}
function GetRandomGrass(map){
    for (var i = 0; i < 11; i++){
        var id = randomInt(0, tiles.length);
        if (tiles[id].texture > 0)
            return id;
    }
    alert("failed to create!");
}
Button({title : "Create a settler", x : 100, y : 300, call : function(){
    var tile_ = GetRandomGrass(tiles);
    if (!tile_) return;
    (PostCommonParsed(JSON.stringify({action : "create", item : "unit", type : 0, userid : userId, tile : tile_}), "units.php").message);
    buffers = initBuffers(gl);
}});
/*Button({title : "Load units and cities", x : 100, y : 320, call : function(){
    buffers = initBuffers(gl);
}});*/
Button({title : "units TRUNCATE (remove all units)", x : 100, y : 450, call : function(){
    try{
    PostCommonParsed(JSON.stringify({action : "truncate"}), "units.php");
    }
    catch(error){
        alert("err!!!");
    }
buffers = initBuffers(gl);

}});