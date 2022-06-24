<?php

require_once '../includes.php';
require_once Moodle\Utils;

if(isset($_GET['user'])){
    $field = $_GET['user']["field"];
    $values = $_GET['user']["values"];
    $result = get_users_by_field($field, $values);
    echo json_encode($result);
}
