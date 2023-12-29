<?php
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("Access-Control-Allow-Origin: http://localhost:4200");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 3600");
        http_response_code(200);
        exit();
    }else{
        header("Access-Control-Allow-Origin: http://localhost:4200");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Allow-Credentials: true");
    }

    include_once "../services/login.php";
    require_once "../utils/consts.php";

    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method){
        case 'POST':
            $json_data = file_get_contents("php://input");
            $json = json_decode($json_data);

            if (property_exists($json, 'email')) {
                $signIn = signIn($json);

                if($signIn){
                    session_start();
                    $token = generateToken(); 
                    $cookieExpiration = time() + 365 * 24 * 60 * 60;                   
                    setcookie('token', $token, $cookieExpiration, '/', 'localhost', false, true); 
                    sendCode(SUCCESS_CODE, "Logged in successfully", $token);
                } else {
                    sendCode(SERVER_ERROR_CODE, "Failed to login", '');
                }
            } else {
                sendCode(SERVER_ERROR_CODE, "Failed to login", '');
            }

            break;
        default:
            sendCode(SERVER_ERROR_CODE, "Not allowed method", '');
            exit();
            break;
    }
?>