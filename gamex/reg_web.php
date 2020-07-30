<?php
//allow sessions to be passed so we can see if the user is logged in
session_start();
 
include_once "login_db.php";
//include out functions file giving us access to the protect() function
include "../../../xyishki.net/htdocs/game/functions.php";
echo "!";
include_once "translate.php";
echo "!";
$website = 'gamex.wattsapp.su';
?>
<html>
	<head>
		<title><? echo $str_register_title;?></title>
		<link rel="stylesheet" type="text/css" href="style.css" />
		<META http-equiv="content-type" content="text/html; charset=utf8">
	</head>
	<body>
		<?php
 
		//Check to see if the form has been submitted
		if(isset($_POST['submit'])){
 
			//protect and then add the posted data to variables
			$username = protect($_POST['username']);
			$password = protect($_POST['password']);
			$passconf = protect($_POST['passconf']);
			$email = protect($_POST['email']);
 
			//check to see if any of the boxes were not filled in
			if(!$username || !$password || !$passconf || !$email){
				//if any weren't display the error message
				echo $str_register_empty_fields;
			}else{
				//if all were filled in continue checking
 
				//Check if the wanted username is more than 32 or less than 3 charcters long
				if(strlen($username) > 32 || strlen($username) < 3){
					//if it is display error message
					echo $str_register_user_length;
				}else{
					//if not continue checking
 
					//select all the rows from out users table where the posted username matches the username stored
					$res = mysql_query("SELECT * FROM `users3d` WHERE `username` = '".$username."'");
					$num = mysql_num_rows($res);
 
					//check if theres a match
					if($num == 1){
						//if yes the username is taken so display error message
						echo $str_register_username_inuse;
					}else{
						//otherwise continue checking
 
						//check if the password is less than 5 or more than 32 characters long
						if(strlen($password) < 5 || strlen($password) > 32){
							//if it is display error message
							echo $str_register_password_length;
						}else{
							//else continue checking
 
							//check if the password and confirm password match
							if($password != $passconf){
								//if not display error message
								echo $str_register_password_confirm;
							}else{
								//otherwise continue checking
 
								//Set the format we want to check out email address against
								$checkemail = "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i";
//								$checkemail = "/^[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+)*)+\\.[a-z]{2,}$/i";
                        
								//check if the formats match
					            if(!preg_match($checkemail, $email)){
					            	//if not display error message
					                echo $str_register_email_invalid;
					            }else{
					            	//if they do, continue checking
 
					            	//select all rows from our users table where the emails match
					            	$res1 = mysql_query("SELECT * FROM `users3d` WHERE `email` = '".$email."'");
					            	$num1 = mysql_num_rows($res1);
 
					            	//if the number of matchs is 1
					            	if($num1 == 1){
					            		//the email address supplied is taken so display error message
										echo $str_register_email_inuse;
									}else{
										//finally, otherwise register there account
 
										//time of register (unix)
						            	$registerTime = date('U');
 
						            	//make a code for our activation key
						            	$code = md5($username).$registerTime;
 
						            	//insert the row into the database
										$res2 = mysql_query("INSERT INTO `users3d` (`username`, `password`, `email`) VALUES('".$username."','".$password."','".$email."')");
 
										//send the email with an email containing the activation link to the supplied email address
										$subject = $str_register_email_subj;
										$message = "$str_register_email_message_prefix\nhttp://www.$website/activate.php?code=$code";
										// In case any of our lines are larger than 70 characters, we should use wordwrap()
										$message = wordwrap($message, 70);
										$from = 'From: noreply@'.$website;
										$send_result = mail($email, $subject, $message, $from);
										if ($send_result){
											echo $str_register_inbox;
										}else{
											echo 'ERRROORRRRR!!!!!!!!!!!!!!!!!!!!';
										}
										//echo "DEBUG: ".$INFO['chatName']." ! ".$email.$username.$website.$code;
										//echo "RESULT: ".$send_result;
										//echo $code;
										if (mail($email, 'test title', 'test message', 'From: admin@xyishki.net')){
											echo 'mail test pass';
										}else{
											echo 'mail test FAIL';
										}
										//display the success message
										echo $str_register_reg_success;
									}
								}
							}
						}
					}
				}
			}
		}
 
		?>
		<center>
		<div id="border">
			<form action="reg_web.php" method="post">
			<? echo $str_register_form_notice;?>
				<table cellpadding="2" cellspacing="0" border="0">
					<tr>
						<td><? echo $str_register_form_name;?></td>
						<td><input type="text" name="username" /></td>
					</tr>
					<tr>
						<td><? echo $str_register_form_pass;?></td>
						<td><input type="password" name="password" /></td>
					</tr>
					<tr>
						<td><? echo $str_register_form_confirm;?></td>
						<td><input type="password" name="passconf" /></td>
					</tr>
					<tr>
						<td><? echo $str_register_form_email;?></td>
						<td><input type="text" name="email" size="25"/></td>
					</tr>
					<tr>
						<td colspan="2" align="center"><input type="submit" name="submit" value="<? echo $str_register_form_btn;?>" /></td>
					</tr>
					<tr>
						<td colspan="2" align="center"><? echo $str_register_form_links;?></td>
					</tr>
				</table>
			</form>
		</div></center>
	</body>
</html>