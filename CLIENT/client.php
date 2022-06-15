<?php

/**
 * Client
 * Return String
 * 
 * Settings and constants
 * 
 * @authorr Renzo Nogueira
 * @version 1.0
 */

class Client
{
    private $token;
    private $domainname;

    /**
     * Client constructor.
     * @param $token
     * @param $domainname
     */
    public function __construct($token = NULL, $domainname = NULL)
    {
        $this->token = $token;
        $this->domainname = $domainname;
    }

    /**
     * getToken
     * Return String
     * 
     * @return string
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * getDomainname
     * Return String
     * 
     * @return string
     */
    public function getDomainname()
    {
        return $this->domainname;
    }
}


// Yours configuration is here
// $CLIENT = new Client('YOUR_TOKEN', 'YOUR_MOODLE_DOMAINNAME');
$CLIENT_WS = new Client('6c450e7a88f01b92388a6adf1f7f6d0c', 'https://ead.grupoevolue.com.br');
$CLIENT_STRIPE = new Client(["pk_test_51Kufx5I4YwwPzrij5CM4NaKXv5z5iNmWAfBfv95eJpCFCqkYaIvianZkwTdYq3tkCEvz6YcqiR2RX9Fk4PqAYWIb00pMIhFU1C"], 'https://api.stripe.com');