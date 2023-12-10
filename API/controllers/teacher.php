<?php
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    include_once "../services/teacher.php";
    require_once "../utils/consts.php";

    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method){
        case 'GET':
            if(isset($_GET['dni'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getTeacherByDni($_GET['dni'])));
            }else if(isset($_GET['email'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getTeacherByEmail($_GET['email'])));
            }else{
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getAllTeachers()));
            }
            break;
        case 'POST':
            $json_data = file_get_contents("php://input");
            $json = json_decode($json_data, true);
            $create = createTeacher($json);
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
            $edit = editTeacher($json);
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