<?php
// Este não é um arquivo oficial do moodle 3.11.4+

/**
 * REST client for 3.11.4+
 * Return JSON or XML format
 * 
 * Moodle user creation
 * 
 * @authorr Renzo Nogueira
 */

/// SETUP - NEED TO BE CHANGED
$token = 'acabec9d20933913f14301785324f579';
$domainname = 'http://www.yourmoodle.com';
$functionname = 'core_user_create_users';

// REST RETURNED VALUES FORMAT
$restformat = 'xml'; //Also possible in Moodle 2.2 and later: 'json'
//Setting it to 'json' will fail all calls on earlier Moodle version

// PARAMETERS - NEED TO BE CHANGED IF YOU CALL A DIFFERENT FUNCTION
// PARÂMETROS - PRECISAM SER ALTERADOS SE VOCÊ CHAMA UMA FUNÇÃO DIFERENTE
$user1 = new stdClass();
$user1->username = 'testeuser';
$user1->password = 'PasswordTesteOfUser1';
$user1->firstname = 'Testfirstname1';
$user1->lastname = 'Testlastname1';
$user1->email = 'email1user@moodle.com';
$user1->auth = 'manual';
$user1->idnumber = '';
$user1->lang = 'en';
$user1->timezone = '-12.5';
$user1->mailformat = 0;
$user1->description = '';
$user1->city = '';
// $user1->customfields = [ // Custom field example
//     [
//         'type' => 'cpf_',
//         'value' => '123.456.789-01'
//     ]
// ];
$user1->country = 'BR';
$users = array($user1);
$params = array('users' => $users);

/// REST CALL
header('Content-Type: text/plain');
$serverurl = $domainname . '/webservice/rest/server.php' . '?wstoken=' . $token . '&wsfunction=' . $functionname;
require_once('./curl.php');
$curl = new curl;

$restformat = ($restformat == 'json') ? '&moodlewsrestformat=' . $restformat : '';
$resp = $curl->post($serverurl . $restformat, $params);
print_r($resp);
