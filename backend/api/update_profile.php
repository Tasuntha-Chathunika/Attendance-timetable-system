<?php
// Update Profile API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id)) {
    $user_id = intval($data->user_id);
    
    $updates = [];
    $types = "";
    $values = [];
    
    if (!empty($data->full_name)) {
        $updates[] = "full_name = ?";
        $types .= "s";
        $values[] = htmlspecialchars(strip_tags($data->full_name));
    }
    
    if (!empty($data->email)) {
        // Check email uniqueness
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $email = htmlspecialchars(strip_tags($data->email));
        $stmt->bind_param("si", $email, $user_id);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Email already taken by another user."]);
            $stmt->close();
            $conn->close();
            exit();
        }
        $stmt->close();
        
        $updates[] = "email = ?";
        $types .= "s";
        $values[] = $email;
    }
    
    if (!empty($data->username)) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $uname = htmlspecialchars(strip_tags($data->username));
        $stmt->bind_param("si", $uname, $user_id);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Username already taken."]);
            $stmt->close();
            $conn->close();
            exit();
        }
        $stmt->close();
        
        $updates[] = "username = ?";
        $types .= "s";
        $values[] = $uname;
    }
    
    if (count($updates) > 0) {
        $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
        $types .= "i";
        $values[] = $user_id;
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            // Fetch updated user data
            $stmt2 = $conn->prepare("SELECT id, full_name, username, email, role FROM users WHERE id = ?");
            $stmt2->bind_param("i", $user_id);
            $stmt2->execute();
            $updated_user = $stmt2->get_result()->fetch_assoc();
            $stmt2->close();
            
            echo json_encode([
                "status" => "success", 
                "message" => "Profile updated successfully.",
                "user" => $updated_user
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to update profile."]);
        }
        $stmt->close();
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "No fields to update."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "User ID required."]);
}

$conn->close();
?>
