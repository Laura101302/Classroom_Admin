<?php
    header('Content-Type: application/json');

    include_once "../services/teacher.php";
    require_once "../utils/consts.php";

    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method){
        case 'GET':
            if(isset($_GET['email'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getTeacherByEmail($_GET['email'])));
            }else{
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getAll()));
            }
            break;
        case 'POST':
            $json_data = file_get_contents("php://input");
            $json = json_decode($json_data, true);
            $signUp = signUpTeacher($json);
            if ($signUp) {
                sendCode(SUCCESS_CODE, "Signed up successfully", '');
            } else {
                sendCode(SERVER_ERROR_CODE, "Error signing up", '');
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