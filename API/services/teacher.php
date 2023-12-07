<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function registerTeacher($json) {
        $exists = getTeacherByEmail($json['email']);

        if ($exists) {
            sendCode(SERVER_ERROR_CODE, "Email already in use", '');
            exit();
        }

        $HASH_PASS = hashPass($json['pass']);
        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO TEACHER values(?, ?, ?, ?, ?, ?, ?, ?)");
        return $sql->execute([$json['dni'], $HASH_PASS, $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['id_role']]);
    }

    function editTeacher($json) {
        $HASH_PASS = hashPass($json['pass']);
        $db = getDatabase();
        
        if(isset($json['pass'])){
            $sql = $db->prepare("UPDATE TEACHER SET DNI = ?, PASS = ?, NAME = ?, SURNAMES = ?, PHONE = ?, EMAIL = ?, BIRTHDATE = ?, ID_ROLE = ? WHERE EMAIL = ?");
            return $sql->execute([$json['dni'], $HASH_PASS, $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['id_role'], $json['email']]);
        }else{
            $sql = $db->prepare("UPDATE TEACHER SET DNI = ?, NAME = ?, SURNAMES = ?, PHONE = ?, EMAIL = ?, BIRTHDATE = ?, ID_ROLE = ? WHERE EMAIL = ?");
            return $sql->execute([$json['dni'], $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['id_role'], $json['email']]);
        }
    }

    function getTeacherByEmail($email) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM TEACHER WHERE EMAIL = ? LIMIT 1;");
        $sql->execute([$email]);
        return $sql->fetchObject();
    }

    function getAll() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM TEACHER;");
        $sql->execute();
        return $sql->fetchObject();
    }

    function teacherLogin($email, $pass) {
        $user = getTeacherByEmail($email);
        if ($user === false) {
            return false;
        }
        $dbPass = $user->PASS;
        $match = verifyPass($pass, $dbPass);
        if (!$match) {
            return false;
        }

        session_start();
        $_SESSION["user"] = $user;
        return true;
    }
?>