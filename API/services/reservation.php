<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createReservation($json) {
        $reservationExists = getReservationById($json['id']);

        if ($reservationExists) {
            sendCode(INTERNAL_SERVER_ERROR_CODE, "ID already in use", '');
            exit();
        }

        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO RESERVATION values(?, ?, ?)");
        return $sql->execute([$json['id'], $json['room_id'], $json['teacher_email']]);
    }

    function editReservation($json) {
        $db = getDatabase();
        $sql = $db->prepare("UPDATE RESERVATION SET id = ?, room_id = ?, teacher_email = ? WHERE id = ?");
        return $sql->execute([$json['id'], $json['room_id'], $json['teacher_email'], $json['id']]);
    }

    function deleteReservation($id) {
        $db = getDatabase();
    
        $getRoomId = $db->prepare("SELECT room_id FROM RESERVATION WHERE id = ?");
        $getRoomId->execute([$id]);
        $roomId = $getRoomId->fetchColumn();
    
        updateState($roomId, 1);
    
        $sql = $db->prepare("DELETE FROM RESERVATION WHERE id = ?");
        return $sql->execute([$id]);
    }

    function getReservationById($id) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM RESERVATION WHERE id = ? LIMIT 1;");
        $sql->execute([$id]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllReservations() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM RESERVATION;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>

