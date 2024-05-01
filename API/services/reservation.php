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

        if(isset($json['seat_id'])){
            $sql = $db->prepare("INSERT INTO RESERVATION values(?, ?, ?, ?)");
            return $sql->execute([$json['id'], $json['room_id'], $json['seat_id'], $json['teacher_email']]);
        }else{
            $sql = $db->prepare("INSERT INTO RESERVATION values(?, ?, ?, ?)");
            return $sql->execute([$json['id'], $json['room_id'], null, $json['teacher_email']]);
        }
    }

    function editReservation($json) {
        $db = getDatabase();
        $sql = $db->prepare("UPDATE RESERVATION SET id = ?, room_id = ?, seat_id = ?, teacher_email = ? WHERE id = ?");
        return $sql->execute([$json['id'], $json['room_id'], $json['seat_id'], $json['teacher_email'], $json['id']]);
    }

    function deleteReservation($id) {
        $db = getDatabase();
    
        $getRoomId = $db->prepare("SELECT room_id FROM RESERVATION WHERE id = ?");
        $getRoomId->execute([$id]);
        $roomId = $getRoomId->fetchColumn();

        $getSeatId = $db->prepare("SELECT seat_id FROM RESERVATION WHERE id = ?");
        $getSeatId->execute([$id]);
        $seatId = $getSeatId->fetchColumn();
    
        updateRoomState($roomId, 1);
        updateSeatState($seatId, 1);
    
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

    function getAllReservationsByTeacherEmail($email) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM RESERVATION WHERE teacher_email = ?;");
        $sql->execute([$email]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>

