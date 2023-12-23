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
        $sql = $db->prepare("UPDATE CENTER SET cif = ?, name = ?, direction = ?, postal_code = ?, city = ?, province = ? WHERE cif = ?");
        return $sql->execute([$json['cif'], $json['name'], $json['direction'], $json['postal_code'], $json['city'], $json['province'], $json['cif']]);
    }

    function deleteCenter($cif){
        $db = getDatabase();
        $sql = $db->prepare("DELETE FROM CENTER WHERE cif = ?");
        return $sql->execute([$cif]);
    }

    function getCenterByCif($cif) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM CENTER WHERE cif = ? LIMIT 1;");
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