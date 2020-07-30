<?

$db_name = 'host1376228_game';
$db_host = 'localhost';
$db_user = 'host1376228_gman';
$db_password = '1Qqr3jA4';

//connect to the database so we can check, edit, or insert data to our users table

$con = mysql_connect($db_host, $db_user, $db_password) or die(mysql_error());
$db = mysql_select_db($db_name, $con) or die(mysql_error());

mysql_query("SET CHARACTER SET utf8");
mysql_query("SET NAMES utf8");

?>