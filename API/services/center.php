<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createCenter($json) {
        $centerExists = getCenterByCif($json['cif']);

        if ($centerExists) {
            sendCode(SERVER_ERROR_CODE, "CIF already in use", '');
            exit();
        }

        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO CENTER values(?, ?, ?, ?, ?, ?)");
        return $sql->execute([$json['cif'], $json['name'], $json['direction'], $json['postal_code'], $json['city'], $json['province']]);
    }

    function editCenter($json) {
        $db = getDatabase();
        $sql = $db->prepare("UPDATE CENTER SET CIF = ?, NAME = ?, DIRECTION = ?, POSTAL_CODE = ?, CITY = ?, PROVINCE = ? WHERE CIF = ?");
        return $sql->execute([$json['cif'], $json['name'], $json['direction'], $json['postal_code'], $json['city'], $json['province'], $json['cif']]);
    }

    function getCenterByCif($cif) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM CENTER WHERE CIF = ? LIMIT 1;");
        $sql->execute([$cif]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllCenters() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM CENTER;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>