<?php
    function verifyPass($pass, $dbPass) {
        return password_verify($pass, $dbPass);
    }

    function hashPass($pass) {
        return password_hash($pass, PASSWORD_BCRYPT);
    }

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
?>