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

    include_once "../services/reservation.php";
    require_once "../utils/consts.php";

    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method){
        case 'GET':
            if(isset($_GET['id'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getReservationById($_GET['id'])));
            }elseif(isset($_GET['email'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getAllReservationsByTeacherEmail($_GET['email'])));
            }elseif(isset($_GET['seat_id'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getAllReservationsDateBySeatId($_GET['seat_id'])));
            }elseif(isset($_GET['room_id'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getAllReservationsDateByRoomId($_GET['room_id'])));
            }else{
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getAllReservations()));
            }
            break;
        case 'POST':
            $json_data = file_get_contents("php://input");
            $json = json_decode($json_data, true);
            $create = createReservation($json);
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
            $edit = editReservation($json);
            if ($edit) {
                sendCode(SUCCESS_CODE, "Correctly edited", '');
            } else {
                sendCode(INTERNAL_SERVER_ERROR_CODE, "Error editing", '');
                exit();
            }
            break;
        case 'DELETE':
            $url = $_SERVER['REQUEST_URI'];
            $params = explode('/', $url);
            $id = $params[count($params) - 2];
            $updateState = filter_var($params[count($params) - 1], FILTER_VALIDATE_BOOLEAN);
            $delete = deleteReservation($id, $updateState);
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
