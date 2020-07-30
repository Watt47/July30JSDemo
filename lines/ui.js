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
    this.setStyle = function(st){
        div.style = st;
    };
}
function buttonClick(e){
    e = e || window.event;
    switch (e.target.id || e.originalTarget.id){
        case "optionsBtn":
            showPopup("options");
            break;
        case "soundCheck":
            localStorage.setItem("sound", document.getElementById("soundCheck").checked);
            break;
        case "reset":
            var reset = confirm("All user stats will be reset! Are you sure?");
            if (reset)
                localStorage.clear();
            else
                alert("No = user canceled!");
            break;
        case "optsclose":
            hideOptions();
            break;
        case "statsBtn":
            showPopup("stats");
            fillTable();
            break;
        case "statsclose":
            hidePopup("stats");
            break;
        case "start":
            document.location.reload();
            break;
        default:
            alert(e.originalTarget.id);
    }
}
function fillTable(){
    var div = document.getElementById("stats");
  //  div.
  var child = document.getElementById("statsTbl");
  if (child)
div.removeChild(child);
  //    var body = document.getElementsByTagName('body')[0];
  var tbl = document.createElement('table');
  tbl.id = "statsTbl";
  tbl.style.width = '100%';
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
              var num = parseInt(localStorage.getItem("stats"));
    var th = document.createElement('tr');
    var th1 = document.createElement('th');
    var th2 = document.createElement('th');
    var th3 = document.createElement('th');
    var th4 = document.createElement('th');
    th1.appendChild(document.createTextNode("username"));
    th2.appendChild(document.createTextNode("atoms"));
    th3.appendChild(document.createTextNode("reactions"));
    th4.appendChild(document.createTextNode("energy"));
    th.appendChild(th1);
    th.appendChild(th2);
    th.appendChild(th3);
    th.appendChild(th4);
    tbdy.appendChild(th);

  for (var i = 0; i < num; i++) {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    td1.appendChild(document.createTextNode(localStorage.getItem("username" + i)));
    td2.appendChild(document.createTextNode(localStorage.getItem("atoms" + i)));
    td3.appendChild(document.createTextNode(localStorage.getItem("reactions" + i)));
    td4.appendChild(document.createTextNode(localStorage.getItem("energy" + i)));
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  
  div.appendChild(tbl);
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
function UI(){
   /* Button({x : 150, y : 100, title : "Sound water", call : function(){
        waterSound.play();
    }});
    Button({x : 150, y : 200, title : "Sound air", call : function(){
        airSound.play();
    }});*/
  //  Button({x : 0, y : 0, title : "Menu", call : function(){
  //      showPopup("menu");
//    }});
   // document.getElementById("start")
}
function hideOptions(){
    hidePopup("options");
}
function showPopup(id){
  document.getElementById(id).style.display = "block";
}
function hidePopup(id){
  document.getElementById(id).style.display = "none";
}