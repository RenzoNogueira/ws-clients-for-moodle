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
    public function __construct($token, $domainname)
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
$CLIENT = new Client('YOUR_TOKEN', 'YOUR_MOODLE_DOMAINNAME');