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
        $this->userData = $this->proccessUrl($arrayDataUser);
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
