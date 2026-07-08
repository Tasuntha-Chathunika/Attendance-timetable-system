<?php
// Change Password API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->current_password) && !empty($data->new_password)) {
    $user_id = intval($data->user_id);
    $current_password = $data->current_password;
    $new_password = $data->new_password;
    
    if (strlen($new_password) < 6) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "New password must be at least 6 characters."]);
        $conn->close();
        exit();
    }
    
    // Verify current password
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        if (password_verify($current_password, $user['password'])) {
            // Hash new password and update
            $hashed = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt2 = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt2->bind_param("si", $hashed, $user_id);
            
            if ($stmt2->execute()) {
                echo json_encode(["status" => "success", "message" => "Password changed successfully."]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Failed to update password."]);
            }
            $stmt2->close();
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Current password is incorrect."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "User not found."]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "User ID, current password, and new password required."]);
}

$conn->close();
?>
