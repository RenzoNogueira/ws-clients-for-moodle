<?php
require_once('Utils.php');

// roleid int               - Role to assign to the user
// userid int               - The user that is going to be enrolled
// courseid int             - The course to enrol the user role in
// timestart int  Opcional  - Timestamp when the enrolment start
// timeend int  Opcional    - Timestamp when the enrolment end
// suspend int  Opcional    - set to 1 to suspend the enrolment
$enrolments = array(
		array(
			'roleid' => 0,
            'userid' => 0,
            'courseid' => 0,
            'timestart' => 0,
            'timeend' => 0,
            'suspend' => 0,
		),
);

$result = enroll_user_course($enrolments);