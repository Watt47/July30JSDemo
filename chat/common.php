<?
function SQLError($res){
    if (!$res) {
        return json_encode(array("result" => "error", "message" => "Invalid query ($sql): ".mysql_error().'"'), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
function LogOutput($output){
	$input = mysql_real_escape_string(var_export($_REQUEST, true));
	$sql = "INSERT INTO `log` (`id`, `input`, `output`, `datetime`) VALUES (NULL, '$input', '$output', CURRENT_TIMESTAMP)";
	//echo $sql;
	mysql_query($sql);
}
?>