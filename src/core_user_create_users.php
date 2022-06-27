<?php

/*
* core_user_create_users
* Return String
* @description: Creates users in Moodle
* @author Renzo Nogueira
*/

require_once '../includes.php';
require_once Moodle\Utils;

header('Content-Type: application/json');

$users = [];
if(isset($_POST['user'])){
	$user = $_POST['user'];
	$users[] = $user;
}

$result = create_users($users);

// Se não houver nenhuma mensagem de erro, então o usuário foi criado com sucesso.
if (!isset($result['exception']) && !isset($result['invalid_parameter_exception'])) {
	$result['status'] = 'success';
}

// Se houver mensagem de erro rettoranr o erro, caso contrário, retornar o sucesso.
echo isset($result['exception']) ? json_encode([$result['exception'], isset($result['debuginfo']) ? $result['debuginfo'] : 0, $result['message']]) : json_encode($result);
