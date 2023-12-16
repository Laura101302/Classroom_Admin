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

    include_once "../services/course.php";
    require_once "../utils/consts.php";

    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method){
        case 'GET':
            if(isset($_GET['code'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getCourseByCode($_GET['code'])));
            }else{
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getAllCourses()));
            }
            break;
        case 'POST':
            $json_data = file_get_contents("php://input");
            $json = json_decode($json_data, true);
            $create = createCourse($json);
            if ($create) {
                sendCode(SUCCESS_CODE, "Created successfully", '');
            } else {
                sendCode(SERVER_ERROR_CODE, "Error creating", '');
                exit();
            }
            break;
        case 'PUT':
            $json_data = file_get_contents("php://input");
            $json = json_decode($json_data, true);
            $edit = editCourse($json);
            if ($edit) {
                sendCode(SUCCESS_CODE, "Correctly edited", '');
            } else {
                sendCode(SERVER_ERROR_CODE, "Error editing", '');
                exit();
            }
            break;
        default:
            sendCode(SERVER_ERROR_CODE, "Not allowed method", '');
            exit();
            break;
    }
?>