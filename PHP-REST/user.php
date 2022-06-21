<?php

/**
 * UserProcessor
 * Return String
 * 
 * Converting the array to a string
 * 
 * @authorr Renzo Nogueira
 */
class UserProcessor
{
    private $userData;

    /**
     * UserProcessor arrayDataUser.
     * 
     * Initialize the $userData.
     * 
     * @param $userData
     */
    public function __construct($arrayDataUser)
    {
        // List the fields you will receive here
        // Verific the array is not empty
        $this->userData = new stdClass();
        $this->userData->username = isset($arrayDataUser->username) ? $arrayDataUser->username : '';
        $this->userData->password = isset($arrayDataUser->password) ? $arrayDataUser->password : '';
        $this->userData->firstname = isset($arrayDataUser->firstname) ? $arrayDataUser->firstname : '';
        $this->userData->lastname = isset($arrayDataUser->lastname) ? $arrayDataUser->lastname : '';
        $this->userData->email = isset($arrayDataUser->email) ? $arrayDataUser->email : '';
        $this->userData->auth = isset($arrayDataUser->auth) ? $arrayDataUser->auth : 'manual';
        $this->userData->idnumber = isset($arrayDataUser->idnumber) ? $arrayDataUser->idnumber : '';
        $this->userData->lang = isset($arrayDataUser->lang) ? $arrayDataUser->lang : 'pt_br';
        $this->userData->timezone = isset($arrayDataUser->timezone) ? $arrayDataUser->timezone : '-12.5';
        $this->userData->mailformat = isset($arrayDataUser->mailformat) ? $arrayDataUser->mailformat : 0;
        $this->userData->description = isset($arrayDataUser->description) ? $arrayDataUser->description : '';
        $this->userData->city = isset($arrayDataUser->city) ? $arrayDataUser->city : '';
        $this->userData->customfields = isset($arrayDataUser->customfields) ? $arrayDataUser->customfields : '';

        // Add the obj to the array
        $this->userData = [$this->userData];

        // Convert the array to a string
        $this->userData = $this->proccessUrl($this->userData);
    }

    /**
     * proccessUrl
     * Return String
     * 
     * @param array $userData
     * @return string
     */
    private function proccessUrl($userData)
    {
        $dataUser = "";
        foreach ($userData as $key => $value) {
            foreach ($value as $key2 => $value2) {
                if (!is_array($value2)) {
                    $dataUser .= "&users[$key][$key2]=" . $value2;
                } else {
                    foreach ($value2 as $key3 => $value3) {
                        foreach ($value3 as $key4 => $value4) {
                            $dataUser .= "&users[$key][$key2][$key3][$key4]=" . $value4;
                        }
                    }
                }
            }
        }
        var_dump($dataUser);
        return $dataUser;
    }

    /**
     * getUserDataUrl
     * Return String
     * 
     * @return string
     */
    public function getUserDataUrl()
    {
        return $this->userData;
    }
}
