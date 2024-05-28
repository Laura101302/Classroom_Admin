<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createRoom($json) {
        $roomExists = getRoomById($json['id']);
    
        if ($roomExists) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "ID already in use", '');
            exit();
        }
    
        $allowed_roles_ids = implode(',', $json['allowed_roles_ids']);
        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO ROOM values(?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $query = $sql->execute([$json['id'], $json['name'], $json['seats_number'], $json['floor_number'], $json['reservation_type'], $json['state'], $allowed_roles_ids, $json['room_type_id'], $json['center_cif']]);
        $id = $db->lastInsertId();
        return ['query' => $query, 'id' => $id];
    }

    function editRoom($json) {
        $allowed_roles_ids = implode(',', $json['allowed_roles_ids']);
        $db = getDatabase();
        $sql = $db->prepare("UPDATE ROOM SET id = ?, name = ?, seats_number = ?, floor_number = ?, reservation_type = ?, state = ?, allowed_roles_ids = ?, room_type_id = ?, center_cif = ? WHERE id = ?");
        return $sql->execute([$json['id'], $json['name'], $json['seats_number'], $json['floor_number'], $json['reservation_type'], $json['state'],  $allowed_roles_ids, $json['room_type_id'], $json['center_cif'], $json['id']]);
    }

    function deleteRoom($id) {
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

    function getAllRoomsByCif($cif) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM ROOM WHERE center_cif = ?");
        $sql->execute([$cif]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllRooms() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM ROOM;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function updateSeatsNumber($id){
        $db = getDatabase();
        $sql = $db->prepare("UPDATE ROOM SET seats_number = seats_number - 1 WHERE id = ?;");
        $sql->execute([$id]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>