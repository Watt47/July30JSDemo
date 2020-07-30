<?php
include_once "login_db.php";
include_once "common.php";
include_once("server.php");
//include_once "./functions.php";
$out = register(mysql_real_escape_string($_POST[username]), mysql_real_escape_string($_POST[password]), mysql_real_escape_string($_POST[email]));
LogOutput($out);
echo $out;
function register($user, $password, $email){
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
        return json_encode(array("result" => "error", "message" => "$email is not a valid email!"), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $sql = "INSERT INTO `users` (`username`, `password`, `email`) VALUES ('$user', '$password', '$email')";
	$res = mysql_query($sql);
	if ($res){
	    echo createUnit(mysql_insert_id(), mt_rand(-180, 180), mt_rand(-90, 90));
	}
	$result = $res ? "success" : "error";
	$message = $res ? "user registered!" : "Invalid query ($sql): ".mysql_error().'"';
	return json_encode(array("result" => $result, "message" => $message), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>