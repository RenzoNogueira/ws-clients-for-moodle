<?php

$config = new stdClass;
// $config->server = 'http://example.com';
// $config->token = '4d10cee0cfd3f987f93e178ec7fd1cec';
// $config->stripe_pk = 'pk_test_...';
$config->server_address = $config->server . '/webservice/rest/server.php';
$config->stripe_server = 'https://api.stripe.com';

$config->server = 'https://ead.grupoevolue.com.br';
$config->token = '6c450e7a88f01b92388a6adf1f7f6d0c';
$config->stripe_pk = 'pk_test_51Kufx5I4YwwPzrij5CM4NaKXv5z5iNmWAfBfv95eJpCFCqkYaIvianZkwTdYq3tkCEvz6YcqiR2RX9Fk4PqAYWIb00pMIhFU1C';

return $config;
