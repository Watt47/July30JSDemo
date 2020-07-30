<?php
session_start();
ob_start();
 
include_once "login_db.php";
 
//include out functions file giving us access to the protect() function made earlier
include "../../../xyishki.net/htdocs/game/functions.php";
//include "translate.php";
include "../../../xyishki.net/htdocs/game/english.php";
//next lines replace locally string from englsh,php:
//////////////

$str_login_form_links = '<a href="reg_web.php">Register </a> | <a href="forgot.php">Forgot Pass  </a>';
$str_register_form_links = "<a href=\"login_web.php\">Login / Войти</a> | <a href=\"forgot.php\">Forgot Pass  </a>";
$str_forgot_form_links = '<a href="reg_web.php">Register </a> | <a href="login_web.php">Login</a>';

//////////////
?>
<html>
<head>

<META http-equiv="content-type" content="text/html; charset=utf8">
		<title><? echo $str_login_title;?></title>
		<link rel="stylesheet" type="text/css" href="style.css" />
	</head>
	<body>
		<?php
 
		//If the user has submitted the form
		if($_POST['submit']){
			//protect the posted value then store them to variables
			$username = protect($_POST['username']);
			$password = protect($_POST['password']);
 
			//Check if the username or password boxes were not filled in
			if(!$username || !$password){
				//if not display an error message
				echo $str_login_empty_user_password;
			}else{
				//if the were continue checking
 
				//select all rows from the table where the username matches the one entered by the user
				$res = mysql_query("SELECT * FROM `users3d` WHERE `username` = '".$username."'");
				$num = mysql_num_rows($res);
 
				//check if there was not a match
				if($num == 0){
					//if not display an error message
					echo $str_login_user_wrong;
				}else{
					//if there was a match continue checking
 
					//select all rows where the username and password match the ones submitted by the user
					$res = mysql_query("SELECT * FROM `users3d` WHERE `username` = '".$username."' AND `password` = '".$password."'");
					$num = mysql_num_rows($res);
 
					//check if there was not a match
					if($num == 0){
						//if not display error message
						echo $str_login_pass_wrong;
					}else{
						//if there was continue checking
 
						//split all fields fom the correct row into an associative array
						$row = mysql_fetch_assoc($res);
 
						//check to see if the user has not activated their account yet
						if(($row['active'] != 1) ){//!!!!!!!!!!!!
							//if not display error message
							echo $str_login_not_activated;
						}else{
							//if they have log them in
 
							//set the login session storing there id - we use this to see if they are logged in or not
							$_SESSION['uid'] = $row['id'];
							$_SESSION[world] = $row[world];
							$_SESSION[username] = $row[username];
							//show message
							echo $str_login_success;
 
							//update the online field to 50 seconds into the future
							$time = date('U')+50;
							mysql_query("UPDATE `users3d` SET `online` = '".$time."' WHERE `id` = '".$_SESSION['uid']."'");
 
							//redirect them to the usersonline page
							header('Location: gameworld.php');
						}
					}
				}
			}
		}
 
		?><center>
		<form action="login_web.php" method="post">
			<div id="border">
				<? echo $str_login_form_welcome;?>
				<table cellpadding="2" cellspacing="0" border="0">
					<tr>
						<td><? echo $str_login_form_name;?></td>
						<td><input type="text" name="username" /></td>
					</tr>
					<tr>
						<td><? echo $str_login_form_pass;?></td>
						<td><input type="password" name="password" /></td>
					</tr>
					<tr>
						<td colspan="2" align="center"><input type="submit" name="submit" value="<? echo $str_login_form_sbmbtn;?>" /></td>
					</tr>
					<tr>
						<td align="center" colspan="2"><? echo $str_login_form_links;?></td>
					</tr>
				</table>
			</div>
		</form></center>
	</body>
</html>
<?
ob_end_flush();
?>