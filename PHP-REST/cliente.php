<?php
// Este não é um arquivo oficial do moodle 3.11.4+

require_once('./user.php');

/**
 * REST client for 3.11.4+
 * Return JSON or XML format
 * 
 * Moodle user creation
 * 
 * @authorr Renzo Nogueira
 * @version 1.0
 */

/// SETUP - NEED TO BE CHANGED
$token = 'c27c852b1318c37bc903310e691129cd';
$domainname = 'yourmoodle.com.br';
$functionname = 'core_user_create_users';

// REST RETURNED VALUES FORMAT
$restformat = 'xml'; //Also possible in Moodle 2.2 and later: 'json'
//Setting it to 'json' will fail all calls on earlier Moodle version

// PARAMETERS - NEED TO BE CHANGED IF YOU CALL A DIFFERENT FUNCTION
// PARÂMETROS - PRECISAM SER ALTERADOS SE VOCÊ CHAMA UMA FUNÇÃO DIFERENTE
$user1 = new stdClass();
$user1->username = 'testeuser1';
$user1->password = 'PasswordTesteOfUser1';
$user1->firstname = 'Testfirstname2';
$user1->lastname = 'Testlastname2';
$user1->email = 'email2user@moodle.com';
$user1->auth = 'manual';
$user1->idnumber = '';
$user1->lang = 'en';
$user1->timezone = '-12.5';
$user1->mailformat = 0;
$user1->description = '';
$user1->city = '';
$user1->customfields = [ // Custom field example
    [
        'type' => 'cpf_',
        'value' => '123.456.789-01'
    ]
];
$user1->country = 'BR';
$users = array($user1);

// Converting the array to a string
$clientParams = new UserProcessor($users);

/// REST CALL
// header('Content-Type: text/plain');
header('Content-Type: text/xml');
$serverurl = $domainname . '/webservice/rest/server.php' . '?wstoken=' . $token . '&wsfunction=' . $functionname;

require_once('./curl.php');
$curl = new curl;

// Set up and execute the curl process
// Configura e executa o processo curl
$restformat = ($restformat == 'json') ? '&moodlewsrestformat=' . $restformat : '';
$resp = $curl->post($serverurl . $restformat, $clientParams->getUserDataUrl($serverurl));
print_r($resp->text);
