var common = {//these are common functions to be shared among other web apps
    init: function(){
        Element.prototype.createChildElement = function(tag, attribute){//creates child with given attributes and returns it
            var Child = document.createElement(tag);
            if (attribute)
                attribute.split(',').forEach(function(item){
                    if (item.split('=')[0] == "text"){
                        Child.appendChild(document.createTextNode(item.split('=')[1]));
                    }else
                    Child.setAttribute(item.split('=')[0], item.split('=')[1]);
                });
            this.appendChild(Child);
            return Child;
        };
        Element.prototype.setResId = function(identifier){//set localization identifier (html10n.js)
            this.setAttribute("data-l10n-id", identifier);
        };
        }
};
function Post(string) {
   try {
      xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', './server.php', false);
      xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlhttp.send(string);
      return xmlhttp.responseText;
   }
   catch (e) {
      alert(PostError);
   }
}
function Post2JSON(string){
    return JSON.parse(Post(string));
}
Element.prototype.appendRow = function(cells){
    var row = this.insertRow(-1);
    cells.forEach(function(el){
        var cell = row.insertCell(-1);
        cell.innerHTML = el;
    });
}