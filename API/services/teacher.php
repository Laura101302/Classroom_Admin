<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createTeacher($json) {
        $teacherExists = getTeacherByDni($json['dni']);
        $emailExists = getTeacherByEmail($json['email']);

        if ($teacherExists) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "DNI already in use", '');
            exit();
        }

        if ($emailExists) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "Email already in use", '');
            exit();
        }

        if (!checkDni($json['dni'])) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "Invalid dni format", '');
            exit();
        }

        if (!checkPass($json['pass'])) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "Invalid pass format", '');
            exit();
        }

        if (!filter_var($json['email'], FILTER_VALIDATE_EMAIL)) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "Invalid email format", '');
            exit();
        }

        $HASH_PASS = password_hash($json['pass'], PASSWORD_BCRYPT);
        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO TEACHER values(?, ?, ?, ?, ?, ?, ?, ?, ?)");
        return $sql->execute([$json['dni'], $HASH_PASS, $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['center_cif'], $json['role_id']]);
    }

    function editTeacher($json) {
        $HASH_PASS = password_hash($json['pass'], PASSWORD_BCRYPT);
        $db = getDatabase();
        
        if(isset($json['pass'])){
            $sql = $db->prepare("UPDATE TEACHER SET dni = ?, pass = ?, name = ?, surnames = ?, phone = ?, email = ?, birthdate = ?, center_cif = ?, role_id = ? WHERE email = ?");
            return $sql->execute([$json['dni'], $HASH_PASS, $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['center_cif'], $json['role_id'], $json['email']]);
        }else{
            $sql = $db->prepare("UPDATE TEACHER SET dni = ?, name = ?, surnames = ?, phone = ?, email = ?, birthdate = ?, center_cif = ?, role_id = ? WHERE email = ?");
            return $sql->execute([$json['dni'], $json['name'], $json['surnames'], $json['phone'], $json['email'], $json['birthdate'], $json['center_cif'], $json['role_id'], $json['email']]);
        }
    }

    function deleteTeacher($dni){
        $db = getDatabase();
        $sql = $db->prepare("DELETE FROM TEACHER WHERE dni = ?");
        return $sql->execute([$dni]);
    }

    function getTeacherByDni($dni, $getPass = true) {
        $db = getDatabase();
        $sql = $getPass === true
            ? $db->prepare("SELECT * FROM TEACHER WHERE dni = ? LIMIT 1;")
            : $db->prepare("SELECT dni, name, surnames, phone, email, birthdate, center_cif, role_id, email FROM TEACHER WHERE dni = ? LIMIT 1;");
            $sql->execute([$dni]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getTeacherByEmail($email) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM TEACHER WHERE email = ? LIMIT 1;");
        $sql->execute([$email]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllTeachersByCif($cif){
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM TEACHER WHERE center_cif = ?");
        $sql->execute([$cif]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllTeachers() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM TEACHER;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function checkDni($dni) {
        $pattern = '/^\d{8}[A-Za-z]$/';
        return preg_match($pattern, $dni) === 1;
    }

    function checkPass($pass) {
        if (!preg_match('/\d/', $pass)) return false;
        if (!preg_match('/[a-z]/', $pass)) return false;
        if (!preg_match('/[A-Z]/', $pass)) return false;
        
        return true;
    }
?>