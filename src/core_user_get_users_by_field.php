<?php

require_once '../includes.php';
require_once Moodle\Utils;

$field = 'username'; // <string> the search field can be 'id' or 'idnumber' or 'username' or 'email'
$values = array('renzo');  // list of string value to match

$result = get_users_by_field($field, $values);

echo json_encode($result);