<?
include_once "login_db.php";
include_once "common.php";
mysql_query("SET CHARACTER SET utf8");
mysql_query("SET NAMES utf8");
$request = file_get_contents('php://input');
$input = json_decode($request, true);
switch ($input[action]) {
    case 'create':
        $out = insertupdate2json("INSERT INTO `units3d` (`id`, `user_id`, `type`, `tile_id`) VALUES (NULL, '$input[userid]', '$input[type]', '$input[tile]') ");
        break;
    case "load":
        $out = select2json("SELECT * FROM units3d");
        break;
    case "truncate":
        mysql_query("TRUNCATE `units3d`");
        break;
    default:
        $out = "wrong action $input[action]";
        break;
}
LogOutput($out);
echo $out;
?>