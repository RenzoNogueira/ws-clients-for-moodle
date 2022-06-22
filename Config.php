<?php

$config = new stdClass;
$config->server = 'http://example.com';
$config->token = '4d10cee0cfd3f987f93e178ec7fd1cec';
$config->server_address = $config->server . '/webservice/rest/server.php';
$config->stripe_pk = 'pk_test_...';
$config->stripe_server = 'https://api.stripe.com';

return $config;
