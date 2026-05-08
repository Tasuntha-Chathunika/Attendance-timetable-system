<?php
// 1. CORS Headers - React ekata katha karanna idadena eka
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// 2. React eken ewana pre-flight (OPTIONS) request eka block wena eka nawathweema
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database config eka import kireema
require_once '../config/database.php';

// React eken ewana JSON data eka allaganima
$data = json_decode(file_get_contents("php://input"));

// Data okkoma awithda kiyala check kireema
if (
    isset($data->fullName) &&
    isset($data->username) &&
    isset($data->email) &&
    isset($data->password) &&
    isset($data->role)
) {
    // SQL Injection walin berenna data clean kireema
    $full_name = mysqli_real_escape_string($conn, trim($data->fullName));
    $username = mysqli_real_escape_string($conn, trim($data->username));
    $email = mysqli_real_escape_string($conn, trim($data->email));
    $role = mysqli_real_escape_string($conn, $data->role);
    
    // Password eka HASH kireema (Security)
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);

    // Mulinma balanawa me Username eka hari Email eka hari danatama database eke thiyenawada kiyala
    $check_query = "SELECT id FROM users WHERE username = '$username' OR email = '$email' LIMIT 1";
    $check_result = mysqli_query($conn, $check_query);

    if (mysqli_num_rows($check_result) > 0) {
        // User danatama innawa nam
        echo json_encode(["status" => "error", "message" => "Username or Email already exists!"]);
    } else {
        // Aluth user wa INSERT query eka
        $insert_query = "INSERT INTO users (full_name, username, email, password, role) 
                         VALUES ('$full_name', '$username', '$email', '$hashed_password', '$role')";
        
        if (mysqli_query($conn, $insert_query)) {
            // Success
            echo json_encode(["status" => "success", "message" => "User registered successfully!"]);
        } else {
            // DB Error
            echo json_encode(["status" => "error", "message" => "Database insertion failed: " . mysqli_error($conn)]);
        }
    }
} else {
    // Data incomplete nam
    echo json_encode(["status" => "error", "message" => "Incomplete data. Please fill all fields."]);
}

mysqli_close($conn);
?>