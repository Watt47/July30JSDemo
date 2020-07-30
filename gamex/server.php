
<?
include_once "login_db.php";
include_once "common.php";
function getCities($user_id){
    if ($user_id)
        $sql = "SELECT * FROM `cities` WHERE `user_id` = '$user_id'";
    else
        $sql = "SELECT * FROM `cities` WHERE 1";
    return select2json($sql);
}
function getUnits(){
    $sql = "SELECT * FROM `units` WHERE 1";
    return select2json($sql);
}
function createCity($user_id, $x, $y, $name, $unit_id){
  //  Log_("DELETE FROM units WHERE `id` = '$unit_id'");
    mysql_query("DELETE FROM units WHERE `id` = '$unit_id'");
    $sql = "INSERT INTO `cities` (`user_id`, `x`, `y`, `name`) VALUES ('$user_id', '$x', '$y', '$name')";
//    Log_($sql);
	$res = mysql_query($sql);
	$result = $res ? "success" : "error";
	$message = $res ? "city registered!" : "Invalid query ($sql): ".mysql_error().'"';
	return json_encode(array("result" => $result, "message" => $message), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
function createUnit($user_id, $x, $y){
    $sql = "INSERT INTO `units` (`user_id`, `x`, `y`) VALUES ('$user_id', '$x', '$y')";
    LogOutput($sql);
   // echo $sql;
	$res = mysql_query($sql);
	$result = $res ? "success" : "error";
	$message = $res ? "unit registered!" : "Invalid query ($sql): ".mysql_error().'"';
	return json_encode(array("result" => $result, "message" => $message), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
function moveUnit($id, $x, $y){
    $sql = "UPDATE `units` SET x = '$x', y = '$y' WHERE id = '$id'";
	$res = mysql_query($sql);
	$result = $res ? "success" : "error";
	$message = $res ? "unit moved!" : "Invalid query ($sql): ".mysql_error().'"';
	return json_encode(array("result" => $result, "message" => $message), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
function getChat(){
    $sql = "SELECT `time`, `username`, `message` FROM `chat`, `users` WHERE `users`.`id` = `user_id`";
    return select2json($sql);
}
function chat($user_id, $message){
    $sql = "INSERT INTO `chat` (`user_id`, `message`) VALUES ('$user_id', '$message')";
	$res = mysql_query($sql);
	$result = $res ? "success" : "error";
	$message = $res ? "message registered!" : "Invalid query ($sql): ".mysql_error().'"';
	return json_encode(array("result" => $result, "message" => $message), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
function getStatCities(){
    $sql = "SELECT username, COUNT(name) as city_num, SUM(population) as population_total FROM `cities`, users WHERE user_id = users.id GROUP BY username ORDER BY population_total DESC";
    return select2json($sql);
}
function getStatUnits(){
    $sql = "SELECT username, COUNT(user_id) as `unit_num` FROM `units`,users WHERE user_id = users.id GROUP BY username ORDER BY unit_num DESC";
    return select2json($sql);
}
function saveEarth($data, $name){
    $sql = "INSERT `planets` (`name`, `data`) VALUES ('$name', '$data')";
	$res = mysql_query($sql);
	$result = $res ? "success" : "error";
	$message = $res ? "earth registered!" : "Invalid query ($sql): ".mysql_error().'"';
	return json_encode(array("result" => $result, "message" => $message), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
switch ($_POST[action]){
    case "get":
        switch ($_POST[item]){
            case "cities":
                $out = getCities(mysql_real_escape_string($_POST[user_id]));
                break;
            case "stat_cities":
                $out = getStatCities();
                break;
            case "stat_units":
                $out = getStatUnits();
                break;
            case "units":
                $out = getUnits();
                break;
        }
        break;
    case "create":
        switch ($_POST[item]){
            case "city":
                $out = createCity(mysql_real_escape_string($_POST[user_id]), mysql_real_escape_string($_POST[x]), mysql_real_escape_string($_POST[y]), mysql_real_escape_string($_POST[name]), mysql_real_escape_string($_POST[unit_id]));
                break;
            case "unit":
                $out = createUnit(mysql_real_escape_string($_POST[user_id]), mysql_real_escape_string($_POST[x]), mysql_real_escape_string($_POST[y]));
                break;
        }
        break;
    case "move":
        $out = moveUnit(mysql_real_escape_string($_POST[id]), mysql_real_escape_string($_POST[x]), mysql_real_escape_string($_POST[y]));
        break;
    case "chat":
        $out = chat(mysql_real_escape_string($_POST[user_id]), mysql_real_escape_string($_POST[message]));
        break;
    case "getchat":
        $out = getChat();
        break;
    case "hello":
        $out = "Hello!";
        break;
    case "saveearth":
        $out = saveEarth(mysql_real_escape_string($_POST[data]), mysql_real_escape_string($_POST[name]));
        break;
}
LogOutput($out);
echo $out;
?>