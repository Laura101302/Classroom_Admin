<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function updatePass($json) {
        if (!filter_var($json['email'], FILTER_VALIDATE_EMAIL)) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "Invalid email format", '');
            exit();
        }
        
        if (!checkPass($json['pass'])) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "Invalid pass format", '');
            exit();
        }
        
        $HASH_PASS = password_hash($json['pass'], PASSWORD_BCRYPT);
        $db = getDatabase();
        
        $sql = $db->prepare("UPDATE TEACHER SET pass = ? WHERE email = ?");
        return $sql->execute([$HASH_PASS, $json['email']]);
    }

    function checkPass($pass) {
        if (!preg_match('/\d/', $pass)) return false;
        if (!preg_match('/[a-z]/', $pass)) return false;
        if (!preg_match('/[A-Z]/', $pass)) return false;
        
        return true;
    }
?>