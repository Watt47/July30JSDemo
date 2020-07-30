<?
include_once "login_db.php";
include_once "common.php";
mysql_query("SET CHARACTER SET utf8");
mysql_query("SET NAMES utf8");
$request = file_get_contents('php://input');
$input = json_decode($request, true);
switch ($input[action]) {
    case 'load':
        $out = select2json("SELECT `planet`, `starttime`, `name`, `data` FROM `worlds`, `planets` WHERE `planets`.`id` = `planet` AND worlds.id = '$input[id]'");
        break;
    default:
        $out = "wrong action $input[action]";
        break;
}
LogOutput($out);
echo $out;
?>