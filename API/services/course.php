<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createCourse($json) {
        $courseExists = getCourseByCode($json['code']);

        if ($courseExists) {
            sendCode(SERVER_ERROR_CODE, "Code already in use", '');
            exit();
        }

        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO COURSE values(?, ?, ?)");
        return $sql->execute([$json['code'], $json['name'], $json['cif_center']]);
    }

    function editCourse($json) {
        $db = getDatabase();
        $sql = $db->prepare("UPDATE COURSE SET CODE = ?, NAME = ?, CIF_CENTER = ?");
        return $sql->execute([$json['code'], $json['name'], $json['cif_center'],]);
    }

    function getCourseByCode($code) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM COURSE WHERE CODE = ? LIMIT 1;");
        $sql->execute([$code]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllCourses() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM COURSE;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>