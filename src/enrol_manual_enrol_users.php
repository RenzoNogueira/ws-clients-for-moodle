<?php

require_once '../includes.php';
require_once Moodle\Utils;

if (isset($_POST['data'])) {
    $user = $_POST['data'];
    $enrolments = array(
        array(
            'roleid' => 5, // student
            'userid' => $user['userid'],
            'courseid' => $user['courseid'],
            // 'timestart' => 0,
            // 'timeend' => 0,
            // 'suspend' => 0,
        ),
    );

    $result = enroll_user_course($enrolments);
    echo json_encode($result);
}
