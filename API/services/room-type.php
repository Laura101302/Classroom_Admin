<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createRoomType($json) {
        $roomTypeExists = getRoomTypeById($json['id']);

        if ($roomTypeExists) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "ID already in use", '');
            exit();
        }

        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO ROOM_TYPE values(?, ?)");
        return $sql->execute([$json['id'], $json['name']]);
    }

    function editRoomType($json) {
        $db = getDatabase();
        $sql = $db->prepare("UPDATE ROOM_TYPE SET name = ? WHERE id = ?");
        return $sql->execute([$json['name'], $json['id']]);
    }

    function deleteRoomType($id){
        $db = getDatabase();
        $sql = $db->prepare("DELETE FROM ROOM_TYPE WHERE id = ?");
        return $sql->execute([$id]);
    }

    function getRoomTypeById($id) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM ROOM_TYPE WHERE id = ? LIMIT 1;");
        $sql->execute([$id]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllRoomTypes() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM ROOM_TYPE;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>