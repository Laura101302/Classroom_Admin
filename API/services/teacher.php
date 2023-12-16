<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createTeacher($json) {
        $teacherExists = getTeacherByDni($json['dni']);
        $emailExists = getTeacherByEmail($json['email']);

        if ($teacherExists) {
            sendCode(SERVER_ERROR_CODE, "DNI already in use", '');
            exit();
        }

        if ($emailExists) {
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
            $sql = $db->prepare("UPDATE TEACHER SET dni = ?, pass = ?, name = ?, surnames = ?, phone = ?, email = ?, birthdate = ?, id_role = ? WHERE email = ?");
            return $sql->execute([$json['dni'], $HASH_PASS, $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['id_role'], $json['email']]);
        }else{
            $sql = $db->prepare("UPDATE TEACHER SET dni = ?, name = ?, surnames = ?, phone = ?, email = ?, birthdate = ?, id_role = ? WHERE email = ?");
            return $sql->execute([$json['dni'], $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['id_role'], $json['email']]);
        }
    }

    function deleteTeacher($dni){
        $db = getDatabase();
        $sql = $db->prepare("DELETE FROM TEACHER WHERE dni = ?");
        return $sql->execute([$dni]);
    }

    function getTeacherByDni($dni) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM TEACHER WHERE dni = ? LIMIT 1;");
        $sql->execute([$dni]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getTeacherByEmail($email) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM TEACHER WHERE email = ? LIMIT 1;");
        $sql->execute([$email]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllTeachers() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM TEACHER;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    // function teacherLogin($email, $pass) {
    //     $user = getTeacherByEmail($email);
    //     if ($user === false) {
    //         return false;
    //     }
    //     $dbPass = $user->PASS;
    //     $match = verifyPass($pass, $dbPass);
    //     if (!$match) {
    //         return false;
    //     }

    //     session_start();
    //     $_SESSION["user"] = $user;
    //     return true;
    // }
?>