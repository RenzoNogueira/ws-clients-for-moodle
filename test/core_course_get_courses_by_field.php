<?php
require_once('Utils.php');

$field = "id";
$value = 123;


$result = get_users_by_field($field, $value);

var_dump($result); // return both category and sub-category