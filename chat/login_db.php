<?
$db_name = 'host1376228_chat';
$db_host = 'localhost';
$db_user = 'host1376228_chat';
$db_password = 'host1376228_';

//connect to the database so we can check, edit, or insert data to our users table

$con = mysql_connect($db_host, $db_user, $db_password) or die(mysql_error());
$db = mysql_select_db($db_name, $con) or die(mysql_error());

mysql_query("SET CHARACTER SET utf8");
mysql_query("SET NAMES utf8");
?>