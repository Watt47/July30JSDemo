<?
require_once "login_db.php";
require_once "common.php";
switch ($_POST[action]){
    case "put":
        $out = logMessage(mysql_real_escape_string($_POST[user]), mysql_real_escape_string($_POST[message]));  
        break;
    case "get":
        $out = getMessages();
        break;
}
//LogOutput($out);
echo $out;
function getMessages(){
    $sql = "SELECT id, stamp, user, message FROM (SELECT * FROM messages ORDER BY id DESC LIMIT 30) sub ORDER BY id";
    $res = mysql_query($sql);
	$num = mysql_num_rows($res);
	$rows = array();
	while ($row = mysql_fetch_assoc($res))
		$rows[] = $row;
	return json_encode(array("num" => $num, "data" => $rows, "result" => "success"));
}
function logMessage($user, $message){
    $sql = "INSERT INTO messages (`user`, `message`) VALUES ('$user', '$message')";
    $res = mysql_query($sql);
    if (!$res) {
        return json_encode(array("result" => "error", "message" => "Invalid query ($sql): ".mysql_error().'"'), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }else return json_encode(array("result" => "success", "message" => "message uploaded"), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>