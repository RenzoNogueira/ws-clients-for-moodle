<?php

/*
* Captura de Posts
* Return String
* 
* Receives the post and returns the value
* 
* @authorr Renzo Nogueira
* @version 1.0
*/

if (isset($_POST['user'])) {
    $user = new stdClass();
    // List the fields you will receive here
    $user->username = $_POST["user"]["username"];
    $user->password = $_POST["user"]["password"];
    $user->firstname = $_POST["user"]["firstName"];
    $user->lastname = $_POST["user"]["lastName"];
    $user->email = $_POST["user"]["email"];
    $user->customfields = $_POST["user"]["customFields"];

    $token = $CLIENT_WS->getToken(); // Get token from Moodle
    $domainname = $CLIENT_WS->getDomainname(); // Get domain name from Moodle
    $createUser = new CreateUser($token, $domainname, $user); // Create user
    print($createUser->post()); // Post user
} else if (isset($_POST['getUser'])) {
    $token = $CLIENT_WS->getToken(); // Get token from Moodle
    $domainname = $CLIENT_WS->getDomainname(); // Get domain name from Moodle
    $getUser = new CreateUser($token, $domainname, $_POST['getUser'], "core_user_get_users"); // Get user
    print($getUser->post()); // Get user
}
