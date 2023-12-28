<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createRoom($json) {
        $roomExists = getRoomById($json['id']);

        if ($roomExists) {
            sendCode(SERVER_ERROR_CODE, "ID already in use", '');
            exit();
        }

        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO ROOM values(?, ?, ?, ?, ?, ?)");
        return $sql->execute([$json['id'], $json['name'], $json['seats_number'], $json['floor_number'], $json['room_type_id'], $json['center_cif']]);
    }

    function editRoom($json) {
        $db = getDatabase();
        $sql = $db->prepare("UPDATE ROOM SET id = ?, name = ?, seats_number = ?, floor_number = ?, room_type_id = ?, center_cif = ? WHERE id = ?");
        return $sql->execute([$json['id'], $json['name'], $json['seats_number'], $json['floor_number'], $json['room_type_id'], $json['center_cif'], $json['id']]);
    }

    function deleteRoom($id){
        $db = getDatabase();
        $sql = $db->prepare("DELETE FROM ROOM WHERE id = ?");
        return $sql->execute([$id]);
    }

    function getRoomById($id) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM ROOM WHERE id = ? LIMIT 1;");
        $sql->execute([$id]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllRooms() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM ROOM;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>