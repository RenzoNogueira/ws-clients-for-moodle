<?php

/*
* core_auth_confirm_user
* @descripton: This file checks if the user is confirmed in Moodle.
* @author Renzo Nogueira rz.dev.br
*/

require_once('Utils.php');

header('Content-Type: application/json');

$username = "username";
$password = "password";
$user = array('username' => $username, 'password' => $password);
$result = login_account_user($user);
echo json_encode($result);
