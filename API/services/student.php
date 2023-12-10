<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createStudent($json) {
        $studentExists = getStudentByDni($json['dni']);
        $emailExists = getStudentByEmail($json['email']);

        if ($studentExists) {
            sendCode(SERVER_ERROR_CODE, "DNI already in use", '');
            exit();
        }

        if ($emailExists) {
            sendCode(SERVER_ERROR_CODE, "Email already in use", '');
            exit();
        }

        $HASH_PASS = hashPass($json['pass']);
        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO STUDENT values(?, ?, ?, ?, ?, ?, ?, ?)");
        return $sql->execute([$json['dni'], $HASH_PASS, $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['code_course']]);
    }

    function editStudent($json) {
        $HASH_PASS = hashPass($json['pass']);
        $db = getDatabase();
        
        if(isset($json['pass'])){
            $sql = $db->prepare("UPDATE STUDENT SET DNI = ?, PASS = ?, NAME = ?, SURNAMES = ?, PHONE = ?, EMAIL = ?, BIRTHDATE = ?, CODE_COURSE = ? WHERE EMAIL = ?");
            return $sql->execute([$json['dni'], $HASH_PASS, $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['code_course'], $json['email']]);
        }else{
            $sql = $db->prepare("UPDATE STUDENT SET DNI = ?, NAME = ?, SURNAMES = ?, PHONE = ?, EMAIL = ?, BIRTHDATE = ?, CODE_COURSE = ? WHERE EMAIL = ?");
            return $sql->execute([$json['dni'], $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['code_course'], $json['email']]);
        }
    }

    function getStudentByDni($dni) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM STUDENT WHERE DNI = ? LIMIT 1;");
        $sql->execute([$dni]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getStudentByEmail($email) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM STUDENT WHERE EMAIL = ? LIMIT 1;");
        $sql->execute([$email]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllStudents() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM STUDENT;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    // function studentLogin($email, $pass) {
    //     $user = getStudentByEmail($email);
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