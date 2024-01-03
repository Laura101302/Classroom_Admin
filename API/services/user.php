<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function updatePass($json) {
        $HASH_PASS = password_hash($json['pass'], PASSWORD_BCRYPT);
        $db = getDatabase();
        
        $sql = $db->prepare("UPDATE TEACHER SET pass = ? WHERE email = ?");
        return $sql->execute([$HASH_PASS, $json['email']]);
    }
?>