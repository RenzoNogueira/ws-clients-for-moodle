<?php
/*
* image_course.php
* @descripton: This file makes authentication in Moodle and returns the image of the course.
* @author Renzo Nogueira rz.dev.br
*/
include_once "../Config.php";

header("Content-Type: image/jpeg");

$url = $_GET["url"];
$urlDefault = $_GET["urlDefault"];
$token = $config->token;
$url = str_replace(" ", "%20", $url);
// try {
// Verifica se o caminho existe
$ch = curl_init($url. "?token=$token");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($httpcode == 200) {
    echo $response;
} else {
    $ch = curl_init($urlDefault);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    $response = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    echo $response;
}