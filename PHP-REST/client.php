<?php
// Este não é um arquivo oficial do moodle 3.11.4+

require_once('../autoload.php');
require_once Moodle\PhpRest\User;
require_once Moodle\Client\Client;
require_once Moodle\PhpRest\Curl;

/*
* CreateUser
* Return String
* 
* Sends request to Rest Moodle to perform such action
* 
* @authorr Renzo Nogueira
* @version 1.0
*/
class CreateUser
{
    private $token;
    private $domainname;
    private $functionname;
    private $restformat;
    private $users;
    private $clientParams;
    private $serverurl;
    private $curl;

    /*
    * CreateUser constructor.
    * @param $token
    * @param $domainname
    * @param $functionname
    * @param $restformat
    * @param $users
    */
    public function __construct($token, $domainname, $users, $restformat = 'json',  $functionname  = 'core_user_create_users')
    {
        $this->token = $token;
        $this->domainname = $domainname;
        $this->functionname = $functionname;
        $this->restformat = $restformat;
        $this->users = $users;
        $this->curl = new curl;

        $this->clientParams = new UserProcessor($this->users);
        $this->serverurl = $this->domainname . '/webservice/rest/server.php' . '?wstoken=' . $this->token . '&wsfunction=' . $this->functionname;
        $this->restformat = '&moodlewsrestformat=' . $this->restformat;
    }

    /*
    * post
    * Return XML or JSON format
    *
    * @return string
    */
    public function post()
    {
        $resp = $this->curl->post($this->serverurl . $this->restformat, $this->clientParams->getUserDataUrl($this->serverurl));
        // se exitir erro, retorna o erro exception
        // Converte a string em objeto e retorna o erro
        $resp = json_decode($resp);
        return isset($resp->exception) !== false ? json_encode([$resp->exception, $resp->debuginfo, $resp->message]) : json_encode($resp);
    }
}

if (isset($_POST['user'])) {
    $user = new stdClass();
    // List the fields you will receive here
    $user->username = $_POST["user"]["username"];
    $user->password = $_POST["user"]["password"];
    $user->firstname = $_POST["user"]["firstname"];
    $user->lastname = $_POST["user"]["lastname"];
    $user->email = $_POST["user"]["email"];
    $user->customfields = $_POST["user"]["customfields"];

    $token = $CLIENT_WS->getToken(); // Get token from Moodle
    $domainname = $CLIENT_WS->getDomainname(); // Get domain name from Moodle
    $createUser = new CreateUser($token, $domainname, $user); // Create user
    print($createUser->post()); // Post user
}
