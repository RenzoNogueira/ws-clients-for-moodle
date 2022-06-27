<?php

require_once '../includes.php';
require_once Moodle\Utils;

header('Content-Type: application/json');

if(isset($_GET['course'])){
    $field = $_GET['course']["field"];
    $value = $_GET['course']["value"];
    $result = get_courses_by_field($field, $value);
    echo json_encode($result);
}