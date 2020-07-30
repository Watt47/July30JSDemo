<?php
include_once "login_db.php";
include_once "common.php";
$out = login(mysql_real_escape_string($_POST[email]), mysql_real_escape_string($_POST[password]));
LogOutput($out);
echo $out;
function login ($user, $password){
    $sql = "SELECT * FROM `users` WHERE `email` = '$user' AND `password` = '$password'";
	$res = mysql_query($sql);
	$result = $res ? "success" : "error";
    $message = $res ? mysql_fetch_assoc($res) : "Invalid query ($sql): ".mysql_error().'"';
	return json_encode(array("result" => $result, "message" => $message), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>