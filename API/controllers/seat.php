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

    include_once "../services/seat.php";
    require_once "../utils/consts.php";

    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method){
        case 'GET':
            if(isset($_GET['id'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getSeatById($_GET['id'])));
            }elseif(isset($_GET['room_id'])){
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getAvailableSeatsByRoomId($_GET['room_id'])));
            }else{
                sendCode(SUCCESS_CODE, 'Data recovered successfully', json_encode(getAllSeats()));
            }
            break;
        case 'POST':
            $json_data = file_get_contents("php://input");
            $json = json_decode($json_data, true);
            $create = createSeat($json);
            if ($create) {
                sendCode(SUCCESS_CODE, "Created successfully", '');
            } else {
                sendCode(INTERNAL_SERVER_ERROR_CODE, "Error creating", '');
                exit();
            }
            break;
        case 'PUT':
            if(isset($_GET['id']) && isset($_GET['state'])){
                sendCode(SUCCESS_CODE, 'Updated successfully', updateSeatState($_GET['id'], $_GET['state']));
                exit();
            }else{
                $json_data = file_get_contents("php://input");
                $json = json_decode($json_data, true);
                $edit = editSeat($json);
                if ($edit) {
                    sendCode(SUCCESS_CODE, "Correctly edited", '');
                } else {
                    sendCode(INTERNAL_SERVER_ERROR_CODE, "Error editing", '');
                    exit();
                }
            }
            break;
        case 'DELETE':
            $id = basename($_SERVER['REQUEST_URI']);
            $delete = deleteSeat($id);
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