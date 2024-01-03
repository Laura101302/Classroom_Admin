<?php
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        // header("Access-Control-Allow-Origin: http://localhost:4200");
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Max-Age: 3600");
        http_response_code(200);
        exit();
    }else{
        header("Access-Control-Allow-Origin:*");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
    }

    include_once "../services/user.php";
    require_once "../utils/consts.php";

    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method){
        case 'PUT':
            $json_data = file_get_contents("php://input");
            $json = json_decode($json_data, true);
            $update = updatePass($json);
            if ($update) {
                sendCode(SUCCESS_CODE, "Correctly updated", '');
            } else {
                sendCode(INTERNAL_SERVER_ERROR_CODE, "Error updating", '');
                exit();
            }
            break;
        default:
            sendCode(INTERNAL_SERVER_ERROR_CODE, "Not allowed method", '');
            exit();
            break;
    }
?>