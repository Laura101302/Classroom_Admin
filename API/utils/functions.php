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

    function updateState($id, $state){
        $db = getDatabase();
        $sql = $db->prepare("UPDATE ROOM SET state = ? WHERE id = ?;");
        $sql->execute([$state, $id]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>