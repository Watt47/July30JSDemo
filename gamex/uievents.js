var lastPosition = {};
var maxZoom = -6;
var minZoom = -24;
function attachUI(){
    var canvas = document.getElementById("glcanvas");
    canvas.onclick = function(e){
        if (Date.now() - downStart > 200) return;
        var x;
        var y;
        if (e.pageX || e.pageY) { 
            x = e.pageX;
            y = e.pageY;
        }
        else { 
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } 
        x -= this.offsetLeft + (this.width / 2);
        y -= this.offsetTop + (this.height / 2);
        y = -y;
        x /= (this.width / 2);
        y /= (this.height / 2);
        var vecStart = [x, y, -1, 1];
        vecStart = unproject(vecStart);
        var vecEnd = [x, y, 0, 1];
        vecEnd = unproject(vecEnd);
        var clickVec = [];
        vec4.subtract(clickVec, vecEnd, vecStart);//click direction
        tiles.forEach(function(value, index, array){
            if (!value.getVertex){
         //       alert("undef");
                var tx = value.texture;
                value = new Triangle(value.coords);
                value.setTexture(tx);
                array[index] = value;
            }
            let e1 = value.getVertex(0);
            let e2 = value.getVertex(1);
            let e3 = value.getVertex(2);
            let normal = [];
            vec3.add(normal, e1, e2);
            vec3.add(normal, normal, e3);
            if (vec3.dot(normal, clickVec) > 0)
                return;
            vec3.subtract(e1, e1, vecStart);
            vec3.subtract(e2, e2, vecStart);
            vec3.subtract(e3, e3, vecStart);//this is basis
            let transMat = mat3fromVec3(e1, e2, e3);
            let myVec = [];
            mat3.invert(transMat, transMat);
            vec3.transformMat3(myVec, clickVec, transMat);
         //   console.log(myVec);
            if (myVec[0] > 0 && myVec[1] > 0 && myVec[2] > 0){
              //  alert(vec3.str(myVec));
              activeTriangle = index;
              activeTileText.setText("Selected tri: " + activeTriangle);
              activeUnitsList.setText("Units here: " + getUnitsByTri());
            let e1 = value.getVertex(0);
            let e2 = value.getVertex(1);
            let e3 = value.getVertex(2);
                updateBuffer(e1.concat(e2).concat(e2).concat(e3).concat(e3).concat(e1));
            }
        });
    };
    canvas.onmousedown = function(){
        this.onmousemove = RotateEarthXY;
        downStart = Date.now();
    };
    canvas.ontouchstart = function(){
        this.ontouchmove = RotateEarthXY;
        downStart = Date.now();
    };
    canvas.onmouseup = function(){
        this.onmousemove = null;
        lastPosition = {};
    };
    canvas.ontouchend = function(){
        this.ontouchmove = null;
        lastPosition = {};
    };
}
var downStart;//time
function SelectTriangle(){
    
}
function RotateEarthXY(event){
    event = event || window.event;
    if (typeof(lastPosition.x) != 'undefined') {
        //get the change from last position to this position
        var deltaX = lastPosition.x - (event.clientX || event.touches[0].clientX),
            deltaY = lastPosition.y - (event.clientY || event.touches[0].clientY);

        var ROTATE_FACTOR = 0.001;
   //     camera.rotate(- deltaY * ROTATE_FACTOR,  deltaX * ROTATE_FACTOR);
        inclination += deltaY * ROTATE_FACTOR;
        rotation -= deltaX * ROTATE_FACTOR;
    }
    //set the new last position to the current for next time
    lastPosition = {
        x : event.clientX || event.touches[0].clientX,
        y : event.clientY || event.touches[0].clientY
    };
}
document.onkeypress = function(e) {
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  console.log(e.key);
  switch (e.key) {
    case "Down": // IE specific value
    case "ArrowDown":
      // Do something for "down arrow" key press.
      break;
    case "Up": // IE specific value
    case "ArrowUp":
      // Do something for "up arrow" key press.
      break;
    case "Left": // IE specific value
    case "ArrowLeft":
      // Do something for "left arrow" key press.
      break;
    case "Right": // IE specific value
    case "ArrowRight":
      // Do something for "right arrow" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  e.preventDefault();
};
function createUI(){
    Button({x : 10, y : 50, title : "left", call : function(){
        rotation -= .1;
        return;
        vec3.rotateY(camera.position, camera.position, [0, 0, 0], -.1);
        vec3.rotateY(camera.angle, camera.angle, [0, 0, 0], -.1);
    }});
    Button({x : 260, y : 50, title : "right", call : function(){
        rotation += 0.1;
        return;
        vec3.rotateY(camera.position, camera.position, [0, 0, 0], .1);
        vec3.rotateY(camera.angle, camera.angle, [0, 0, 0], .1);
    }});
    Button({x : 90, y : 10, title : "up", call : function(){inclination += 0.1}});
    Button({x : 80, y : 100, title : "down", call : function(){inclination += -0.1}});
    Button({x : 75, y : 40, title : "zoom in (scroll up)", call : function(){
        if (camera.getEye()[2] >= maxZoom) return;
        camera.forward(1);
    }});
    Button({x : 70, y : 60, title : "zoom out (scroll down)", call : function(){
        if (camera.getEye()[2] <= minZoom) return;
        camera.forward(-1);
    }});
    if (mode == "game") return;
    Button({x : 50, y : 300, title : "Save earth", call : function(){
        var name = prompt("Enter planet name:", "tmp");
        var sendMe = {data : sphere, action : "save", name : name};
        alert("Planet created id: " + PostCommon(JSON.stringify(sendMe), 1, "planets.php"));
    }});
    Button({x : 50, y : 400, title : "Restore earth", call : function(){
        var id = prompt("Enter planet ID to load:");
        if (loadPlanet(id))
            location.replace("?planet=" + id);
    }});
    Button({x : 50, y : 330, title : "Water", call : function(){
        updateTextureBuffer(textureBlue, activeTriangle);
    }});//texture only??? no tiles updated!!???
    Button({x : 50, y : 360, title : "Grass", call : function(){
        updateTextureBuffer(textureGreen, activeTriangle);
    }});
}
function callback(smth){
    alert(smth);
}
function Button(btnInfo){//x,y,caption
    var btn = document.createElement("button");
    btn.appendChild(document.createTextNode(btnInfo.title));
    btn.style.position = "absolute";
    btn.style.top = btnInfo.y + "px";
    btn.style.left = btnInfo.x + "px";
    btn.onclick = function(){return btnInfo.call(btnInfo.title);};
    document.body.appendChild(btn);
}

var myitem = document;
if (myitem.addEventListener){
    // IE9, Chrome, Safari, Opera
    myitem.addEventListener("mousewheel", MouseWheelHandler, false);
    // Firefox
    myitem.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
}
// IE 6/7/8
else{
    myitem.attachEvent("onmousewheel", MouseWheelHandler);
}
//document.
function MouseWheelHandler(e){
    // cross-browser wheel delta
    var e = window.event || e; // old IE support
  //  console.log(e);
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
console.log(camera.getEye());
if (delta > 0 && camera.getEye()[2] >= maxZoom) return;
if (delta < 0 && camera.getEye()[2] <= minZoom) return;
camera.forward(delta);
    return false;
}