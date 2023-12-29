<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function signIn($json) {
        $user = getTeacherByEmail($json->email)[0];

        if($user === false) return false;

        $email = $user['email'];
        $pass = $user['pass'];
        
        if ($json->email === $email && password_verify($json->pass, $pass)) {
            return true;
        } else return false;
    }

    function getTeacherByEmail($email) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM TEACHER WHERE email = ? LIMIT 1;");
        $sql->execute([$email]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>