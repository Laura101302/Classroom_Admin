<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createSeat($json) {
        $seatExists = getSeatById($json['id']);

        if ($seatExists) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "ID already in use", '');
            exit();
        }

        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO SEAT values(?, ?, ?, ?)");
        return $sql->execute([$json['id'], $json['name'], $json['state'], $json['room_id']]);
    }

    function editSeat($json) {
        $db = getDatabase();
        $sql = $db->prepare("UPDATE SEAT SET id = ?, name = ?, state = ?, room_id = ? WHERE id = ?");
        return $sql->execute([$json['id'], $json['name'], $json['state'], $json['room_id'], $json['id']]);
    }

    function deleteSeat($id) {
        $db = getDatabase();
        $sql = $db->prepare("DELETE FROM SEAT WHERE id = ?");
        return $sql->execute([$id]);
    }

    function getSeatById($id) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM SEAT WHERE id = ? LIMIT 1;");
        $sql->execute([$id]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllSeats() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM SEAT;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>