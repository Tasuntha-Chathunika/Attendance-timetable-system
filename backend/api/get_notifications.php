<?php
// Notifications API - Get notifications for a user
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

if (isset($_GET['user_id'])) {
    $user_id = intval($_GET['user_id']);
    
    $notifications = [];
    $stmt = $conn->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $notifications[] = $row;
    }
    $stmt->close();
    
    // Count unread
    $stmt2 = $conn->prepare("SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = 0");
    $stmt2->bind_param("i", $user_id);
    $stmt2->execute();
    $unread = $stmt2->get_result()->fetch_assoc()['unread'];
    $stmt2->close();
    
    echo json_encode([
        "status" => "success",
        "data" => [
            "notifications" => $notifications,
            "unread_count" => (int)$unread
        ]
    ]);
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing user_id."]);
}

$conn->close();
?>
