<?
$ver = "0.02a";
$appname = "CHAT v".$ver;
?>

<HTML>
    <head>
        <title><? echo $appname?></title>
        <style>
            td { 
  white-space: pre-wrap;      /* CSS3 */   
   white-space: -moz-pre-wrap; /* Firefox */    
   white-space: -pre-wrap;     /* Opera <7 */   
   white-space: -o-pre-wrap;   /* Opera 7 */    
   word-wrap: break-word;      /* IE */
                word-break: break-word;
            }
        </style>
    </head>
    <body onload="refreshChat(); setInterval(() => refreshChat(), 5000); document.getElementById('username').value = getCookie('username');" >
        <script src="common.js"></script>
        <script>
            function sendMessage(){
                if (isEmptyOrSpaces(getValueById("username"))){
                    alert("Please enter name first!");
                    return;
                }
                Post("action=put&message=" + fixedEncodeURIComponent(getValueById("yourmessage")) + "&user=" + fixedEncodeURIComponent(getValueById("username")));
                document.getElementById("yourmessage").value = "";
                refreshChat();
            }
            function refreshChat(){
                messages = JSON.parse(Post("action=get"));
                document.getElementById('chattable').innerHTML = '';
                messages.data.forEach(function(el){
                    addRowToTable(Object.values(el), "chattable");
                });
            }
            function saveUsername(){
                saveCookie("username", document.getElementById("username").value);
            }
        </script>
        <center>
            <h1><? echo $appname?></h1>
            <h2><label for="username">Your name:</label><input type=text name=username id=username><input type=button onclick="saveUsername();" value="Save username"></h2>
            <table width=100% ><thead>         <tr>
                    <th width=1>date time</th><th width=1>name</th><th>message</th>                </tr>                
            </thead>
            <tbody id=chattable></tbody>

            </table><div >
            <label for=yourmessage>Your message:</label><input type=text name=yourmessage id=yourmessage onkeyup="checkForEnterKey(this.value);" style="width:90%">
            </div>
        </center>
    </body>
</HTML>