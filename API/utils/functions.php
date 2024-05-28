<?php
    function sendCode($code, $message, $response) {
        if($code == 200){
            $status = 'ok';
        }else{
            $status = 'error';
        }
        $response = [
            'code' => $code,
            'status' => $status,
            'message' => $message,
            'response' => $response,
        ];
        http_response_code($code);
        echo json_encode($response);
    }

    function updateRoomState($id, $state){
        $db = getDatabase();
        $sql = $db->prepare("UPDATE ROOM SET state = ? WHERE id = ?;");
        $sql->execute([$state, $id]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function updateSeatState($id, $state){
        $db = getDatabase();
        $sql = $db->prepare("UPDATE SEAT SET state = ? WHERE id = ?;");
        $sql->execute([$state, $id]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function updateSeatStateByRoomId($room_id, $state) {
        $db = getDatabase();
        $sql = $db->prepare("UPDATE SEAT SET state = ? WHERE room_id = ?;");
        $sql->execute([$state, $room_id]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>