function fixedEncodeURIComponent (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}//https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function addRowToTable(rowArray, tableId){
    var row = document.getElementById(tableId).insertRow(-1);
    rowArray.forEach(function(el, i){
        if (!i) return;
        var cell = row.insertCell();
        if (i == 1){
            el = " [ " + el + " ] ";
        }
        if (i == 2){
            el = " < " + el + " > ";
            cell.style = "cursor:pointer; white-space: pre; ";
            cell.onclick = function(){
                document.getElementById('yourmessage').value = document.getElementById('yourmessage').value + "< " +  document.getElementById("2" + row.rowIndex + "").innerText + " > : " + " ";
            };
        }
        var text = document.createTextNode(el);
        cell.id = Object.keys(rowArray)[i] + row.rowIndex + "";
        if (i == 1){
            cell.style = "white-space: pre;";
        }
        if (i == 3){
            cell.style = "cursor:pointer;";
            cell.onclick = function(){
                document.getElementById('yourmessage').value = document.getElementById('yourmessage').value + "< " +  document.getElementById("2" + row.rowIndex + "").innerText + " > : " + el + " ";
            };
        }
        cell.appendChild(text);
        if (i == 2){
            cell.innerHTML = cell.innerHTML.replace(/M/g, "<img src='/pic/cats+friendly+kitty+pets+icon-1320085819981933451.png' width=16>");
        }
    });
}
function Post(string) {
    try {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', './chat.php', false);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send(string);
        return xmlhttp.responseText;
    }
    catch (e) {
        alert(PostError);
    }
}
function getValueById(id){
    return document.getElementById(id).value;
}
function checkForEnterKey(){
    if (event.keyCode === 13) {
        event.preventDefault();
        sendMessage();
    }
}
function getTarget(e){
    e = e || window.event;
    return (e.target || e.srcElement);
}
function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}
function saveCookie(name, value){
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
}
function getCookie(name){
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
}