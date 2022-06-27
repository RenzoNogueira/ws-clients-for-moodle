<?php

/*
* core_auth_confirm_user
* @descripton: This file checks if the user is confirmed in Moodle.
* @author Renzo Nogueira rz.dev.br
*/

require_once '../includes.php';
require_once Moodle\Utils;

header('Content-Type: application/json');

if (isset($_GET['user'])) {
    $username = $_GET['user']["username"];
    $password = $_GET['user']["password"];
    $user = array('username' => $username, 'password' => $password);
    $result = login_account_user($user);
    echo json_encode($result);
}
