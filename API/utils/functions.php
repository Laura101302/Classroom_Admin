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

    function generateToken() {
        return bin2hex(random_bytes(32));
    }
?>