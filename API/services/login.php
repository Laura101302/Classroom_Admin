<?php
    include_once "../connection/connection.php";
    include_once "../utils/functions.php";
    require_once "../utils/consts.php";
    require '../vendor/autoload.php';
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    function signIn($json) {
        $user = getTeacherByEmail($json->email)[0];

        if($user === false) return false;

        $email = $user['email'];
        $pass = $user['pass'];
        
        if ($json->email === $email && password_verify($json->pass, $pass)) {
            return true;
        } else return false;
    }

    function getTeacherByEmail($email) {
        $db = getDatabase();
        $sql = $db->prepare("SELECT * FROM TEACHER WHERE email = ? LIMIT 1;");
        $sql->execute([$email]);
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    function generateToken($email) {
        $key = getenv('JWT_SECRET');
        $token = [
            "iss" => "classroom_admin",
            "aud" => "user",
            "iat" => time(),
            "exp" => time() + (365 * 24 * 60 * 60), // 1 year
            "sub" => $email
        ];
        return JWT::encode($token, $key, 'HS256');
    }

    function verifyToken($token) {
        $key = getenv('JWT_SECRET');
        $decodedKey = base64_decode($key);

        if (!$token) {
            sendCode(UNAUTHORIZED_ERROR_CODE, 'Token not found', '');
            exit;
        }

        try {
            $decoded = JWT::decode($token, new Key($decodedKey, 'HS256'));
            sendCode(SUCCESS_CODE, 'Token ok', '');
            return true;
        } catch (Exception $e) {
            sendCode(UNAUTHORIZED_ERROR_CODE, 'Invalid token', '');
            return false;
        }
    }
?>