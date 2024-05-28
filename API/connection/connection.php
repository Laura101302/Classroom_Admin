<?php
    function getDatabase() {
        $db_name = "CLASSROOM_ADMIN";
        $user = "root";
        $pass = "";
        
        try {
            $db = new PDO('mysql:host=localhost;dbname=' . $db_name, $user, $pass);
            $db->query("set names utf8;");
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
            return $db;
        } catch (Exception $e) {
            echo "Error getting database: " . $e->getMessage();
            return null;
        }
    }
?>