<?php
// 1. CORS Headers (React ekata backend ekata katha karanna idadena eka)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Database file eka connect karaganna
require_once '../config/database.php';

// 2. React eken ewana JSON data eka allaganna
$data = json_decode(file_get_contents("php://input"));

// Data awithda kiyala check kireema
if(isset($data->username) && isset($data->password)) {
    
    // SQL Injection walin berenna escape kireema
    $username = mysqli_real_escape_string($conn, $data->username);
    $password = $data->password;
    
    // Database eken user wa hoyanawa (Username eken hari Email eken hari)
    $query = "SELECT * FROM users WHERE username = '$username' OR email = '$username'";
    $result = mysqli_query($conn, $query);
    
    if ($row = mysqli_fetch_assoc($result)) {
        // User innawa nam, password eka hariyatanma match wenawada balanawa
        // (Oya ewapu generate_hash.php eke thiyena logic eka mekath ekka weda)
        if (password_verify($password, $row['password'])) {
            
            // Login Success - React ekata user details yawanawa
            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "user" => [
                    "id" => $row['id'],
                    "username" => $row['username'],
                    "role" => $row['role'],
                    "full_name" => $row['full_name']
                ]
            ]);
            
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Please provide username and password"]);
}
?>