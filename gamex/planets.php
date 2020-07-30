<?
include_once "login_db.php";
include_once "common.php";
mysql_query("SET CHARACTER SET utf8");
mysql_query("SET NAMES utf8");
function SavePlanet($name, $data){
    $sql = "INSERT INTO `planets` (`name`, `data`) VALUES ('$name', '$data')";
    mysql_query($sql);
    return mysql_insert_id();
}
function LoadPlanet($id){
    return select2json("SELECT * FROM `planets` WHERE `id`='$id'");
}
switch ($_SERVER[CONTENT_TYPE]){
	case "application/json;charset=UTF-8":
	case "application/json; charset=UTF-8":
	case "application/json":
    	$request = file_get_contents('php://input');
    	$input = json_decode($request, true);
    	switch ($input[action]){
    	    case "save":
    	        $out = SavePlanet($input[name], json_encode($input[data]));
    	        break;
            default:
                $out = "wrong action $input[action]";
    	}
    	break;
    case "application/x-www-form-urlencoded":
        switch ($_POST[action]){
            case "load":
                $out = LoadPlanet($_POST[id]);
                break;
            default:
                $out = "wrong action $_POST[action]";
        }
        break;
    default:
        $out = "error unknown content type $_SERVER[CONTENT_TYPE]";
}
LogOutput($out);
echo $out;
?>