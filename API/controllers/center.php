<?php
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("Access-Control-Allow-Origin: http://localhost:4200");
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

    include_once "../services/center.php";
    require_once "../utils/consts.php";

    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method){
        case 'GET':
            if(isset($_GET['cif'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getCenterByCif($_GET['cif'])));
            }else{
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getAllCenters()));
            }
            break;
        case 'POST':
            $json_data = file_get_contents("php://input");
            $json = json_decode($json_data, true);
            $create = createCenter($json);
            if ($create) {
                sendCode(SUCCESS_CODE, "Created successfully", '');
            } else {
                sendCode(INTERNAL_SERVER_ERROR_CODE, "Error creating", '');
                exit();
            }
            break;
        case 'PUT':
            $json_data = file_get_contents("php://input");
            $json = json_decode($json_data, true);
            $edit = editCenter($json);
            if ($edit) {
                sendCode(SUCCESS_CODE, "Correctly edited", '');
            } else {
                sendCode(INTERNAL_SERVER_ERROR_CODE, "Error editing", '');
                exit();
            }
            break;
        case 'DELETE':
            $cif = basename($_SERVER['REQUEST_URI']);
            $delete = deleteCenter($cif);
            if ($delete) {
                sendCode(SUCCESS_CODE, "Deleted successfully", '');
            } else {
                sendCode(INTERNAL_SERVER_ERROR_CODE, "Error deleting", '');
                exit();
            }
            break;
        default:
            sendCode(INTERNAL_SERVER_ERROR_CODE, "Not allowed method", '');
            exit();
            break;
    }
?>