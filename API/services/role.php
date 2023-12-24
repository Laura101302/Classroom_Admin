<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";

    function createRole($json) {
        $roleExists = getRoleById($json['id']);

        if ($roleExists) {
            sendCode(SERVER_ERROR_CODE, "ID already in use", '');
            exit();
        }

        $db = getDatabase();
        $sql = $db->prepare("INSERT INTO ROLE values(?, ?)");
        return $sql->execute([$json['id'], $json['name']]);
    }

    function editRole($json) {
        $db = getDatabase();
        $sql = $db->prepare("UPDATE ROLE SET name = ? WHERE id = ?");
        return $sql->execute([$json['name'], $json['id']]);
    }

    function deleteRole($id){
        $db = getDatabase();
        $sql = $db->prepare("DELETE FROM ROLE WHERE id = ?");
        return $sql->execute([$id]);
    }

    function getRoleById($id) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM ROLE WHERE id = ? LIMIT 1;");
        $sql->execute([$id]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function getAllRoles() {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM ROLE;");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }
?>