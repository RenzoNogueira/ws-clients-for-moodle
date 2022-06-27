<?php

/**
 * 
 * @purpose	: CRUD functions for Moodle
 * @author	: Sanjay Kumar sanjay.kumar001@gmail.com
 * @author	: Renzo Nogueira rz.dev.br
 *
 **/

require_once('MoodleRest.php');

// Course
function get_courses()
{
	$ws_function = 'core_course_get_courses';
	$param = ["criteria" => []];
	return get_moodle_data($ws_function, $param);
}

function get_courses_by_field($field, $values)
{
	$ws_function = 'core_course_get_courses_by_field';
	$param = ["field" => $field, "value" => $values];
	return get_moodle_data($ws_function, $param);
}

function create_courses($courses)
{
	$ws_function = 'core_course_create_courses';
	$param = ["courses" => $courses];
	return push_data_to_moodle($ws_function, $param);
}

function update_courses($courses)
{
	$ws_function = 'core_course_update_courses';
	$param = ["courses" => $courses];
	return push_data_to_moodle($ws_function, $param);
}

function delete_courses($courseids)
{
	$ws_function = 'core_course_delete_courses';
	$param = ["courseids" => $courseids];
	return push_data_to_moodle($ws_function, $param);
}

function enroll_user_course($enrolments)
{
	$ws_function = 'enrol_manual_enrol_users';
	$param = ["enrolments" => $enrolments];
	return push_data_to_moodle($ws_function, $param);
}

// Category and Sub Category
function create_categories($course_category)
{
	$ws_function = 'core_course_create_categories';
	$param = ["categories" => $course_category];
	return push_data_to_moodle($ws_function, $param);
}

function get_categories($criteria)
{
	$ws_function = 'core_course_get_categories';
	$param = ["criteria" => $criteria];
	return get_moodle_data($ws_function, $param);
}

function delete_categories($categories)
{
	$ws_function = 'core_course_delete_categories';
	$param = ["categories" => $categories];
	return push_data_to_moodle($ws_function, $param);
}

function update_categories($categories)
{
	$ws_function = 'core_course_update_categories';
	$param = ["categories" => $categories];
	return push_data_to_moodle($ws_function, $param);
}

// User
function create_users($users)
{
	$ws_function = 'core_user_create_users';
	$param = ["users" => $users];
	return push_data_to_moodle($ws_function, $param);
}

function get_users()
{
	$ws_function = 'core_user_get_users';
	$param = ["criteria" => []];
	return get_moodle_data($ws_function, $param);
}

function login_account_user($user)
{
	return post_login_account_user($user);
}

function get_users_by_field($field, $values)
{
	$ws_function = 'core_user_get_users_by_field';
	$param = ["field" => $field, 'values' => $values];
	return get_moodle_data($ws_function, $param);
}

function update_users($users)
{
	$ws_function = 'core_user_update_users';
	$param = ["users" => $users];
	return push_data_to_moodle($ws_function, $param);
}

function delete_users($userids)
{
	$ws_function = 'core_user_delete_users';
	$param = ["userids" => $userids];
	return push_data_to_moodle($ws_function, $param);
}

// Role
function assign_roles($assignments)
{
	$ws_function = 'core_role_assign_roles';
	$param = ["assignments" => $assignments];
	return push_data_to_moodle($ws_function, $param);
}

// Cohorts

function get_cohorts($cohortids)
{
	$ws_function = 'core_cohort_get_cohorts';
	$param = ["cohortids" => $cohortids];
	return get_moodle_data($ws_function, $param);
}

function search_cohorts($query, $context, $includes = 'parents')
{
	$ws_function = 'core_cohort_search_cohorts';
	$param = ["query" => $query, "context" => $context, "includes" => $includes];
	return get_moodle_data($ws_function, $param);
}

function create_cohorts($cohorts)
{
	$ws_function = 'core_cohort_create_cohorts';
	$param = ["cohorts" => $cohorts];
	return push_data_to_moodle($ws_function, $param);
}

function update_cohorts($cohorts)
{
	$ws_function = 'core_cohort_update_cohorts';
	$param = ["cohorts" => $cohorts];
	return push_data_to_moodle($ws_function, $param);
}

function delete_cohorts($cohortids)
{
	$ws_function = 'core_cohort_delete_cohorts';
	$param = ["cohortids" => $cohortids];
	return push_data_to_moodle($ws_function, $param);
}

// Cohorts Enrollment
function get_cohort_members($cohortids)
{
	$ws_function = 'core_cohort_get_cohort_members';
	$param = ["cohortids" => $cohortids];
	return get_moodle_data($ws_function, $param);
}

function add_cohort_members($members)
{
	$ws_function = 'core_cohort_add_cohort_members';
	$param = ["members" => $members];
	return push_data_to_moodle($ws_function, $param);
}

function delete_cohort_members($members)
{
	$ws_function = 'core_cohort_delete_cohort_members';
	$param = ["members" => $members];
	return push_data_to_moodle($ws_function, $param);
}

// Calendar
function create_calendar_events($events)
{
	$ws_function = 'core_calendar_create_calendar_events';
	$param = ["events" => $events];
	return push_data_to_moodle($ws_function, $param);
}


function get_key_map($data, $keyfield, $valuefield)
{
	$result = [];
	foreach ($data as $d) {
		$result[$d[$keyfield]] = $d[$valuefield];
	}
	return $result;
}

function convert_to_timestamp($datetime)
{
	$date = new DateTime($datetime);
	return $date->getTimestamp();
}

// Pega o token de acesso do usuário
function get_token()
{
	$config = include('Config.php');
	$token = $config['token'];
	return $token;
}

// Get data from MoodleRest MOODLE
function get_moodle_data($ws_function, $param)
{
	$config = include('Config.php');
	$MoodleRest = new MoodleRest($config->server_address, $config->token);
	return $MoodleRest->request($ws_function, $param, MoodleRest::METHOD_GET);
}

// Push data to MoodleRest MOODLE
function push_data_to_moodle($ws_function, $param)
{
	$config = include('Config.php');
	$MoodleRest = new MoodleRest($config->server_address, $config->token);
	return $MoodleRest->request($ws_function, $param, MoodleRest::METHOD_POST);
}

// Send po
function post_login_account_user($param)
{
	$config = include('Config.php');
	$MoodleRest = new MoodleRest($config->server_address_login, $config->token);
	return $MoodleRest->setPostMethod($param);
}
