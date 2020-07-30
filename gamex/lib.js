function Post(string) {//refactor!
    return PostCommon(string, 0, "server.php");
}
var contentType = ["application/x-www-form-urlencoded", "application/json", "multipart/form-data"];
function PostCommon(string, _contentType, url){
    try {
      xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', url, false);
      xmlhttp.setRequestHeader("Content-Type", contentType[_contentType]);
      xmlhttp.send(string);
      return xmlhttp.responseText;
   }
   catch (e) {
      alert(PostError);
   }
}
function PostCommonParsed(string, url){
    return JSON.parse(PostCommon(string, 1, url));
}