<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $id = intval($data->id);

    $admin_id = isset($data->admin_id) ? intval($data->admin_id) : 0;

    // Prevent deleting themselves
    if ($admin_id === $id) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "You cannot delete your own admin account."]);
        $conn->close();
        exit();
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "User deleted successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "User not found."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to delete user."]);
    }
    
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid or missing user ID."]);
}

$conn->close();
?>
