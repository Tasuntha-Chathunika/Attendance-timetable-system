<?php
// Send notification / Mark as read
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->action)) {
    
    if ($data->action === 'send') {
        // Send notification to specific user or broadcast
        if (!empty($data->title) && !empty($data->message)) {
            $title = htmlspecialchars(strip_tags($data->title));
            $message = htmlspecialchars(strip_tags($data->message));
            $type = !empty($data->type) ? htmlspecialchars(strip_tags($data->type)) : 'info';
            
            if (!empty($data->user_id)) {
                // Single user
                $stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)");
                $uid = intval($data->user_id);
                $stmt->bind_param("isss", $uid, $title, $message, $type);
                $stmt->execute();
                $stmt->close();
            } elseif (!empty($data->broadcast_role)) {
                // Broadcast to all users of a role
                $role = htmlspecialchars(strip_tags($data->broadcast_role));
                $users_result = $conn->query("SELECT id FROM users WHERE role = '$role'");
                $stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)");
                while ($u = $users_result->fetch_assoc()) {
                    $uid = $u['id'];
                    $stmt->bind_param("isss", $uid, $title, $message, $type);
                    $stmt->execute();
                }
                $stmt->close();
            } elseif (!empty($data->broadcast_all) && $data->broadcast_all === true) {
                // Broadcast to ALL users
                $users_result = $conn->query("SELECT id FROM users");
                $stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)");
                while ($u = $users_result->fetch_assoc()) {
                    $uid = $u['id'];
                    $stmt->bind_param("isss", $uid, $title, $message, $type);
                    $stmt->execute();
                }
                $stmt->close();
            }
            
            echo json_encode(["status" => "success", "message" => "Notification sent successfully."]);
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Title and message required."]);
        }
    
    } elseif ($data->action === 'mark_read') {
        if (!empty($data->notification_id)) {
            $nid = intval($data->notification_id);
            $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
            $stmt->bind_param("i", $nid);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Marked as read."]);
        } elseif (!empty($data->user_id) && !empty($data->mark_all)) {
            $uid = intval($data->user_id);
            $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
            $stmt->bind_param("i", $uid);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "All marked as read."]);
        }
    
    } elseif ($data->action === 'delete') {
        if (!empty($data->notification_id)) {
            $nid = intval($data->notification_id);
            $stmt = $conn->prepare("DELETE FROM notifications WHERE id = ?");
            $stmt->bind_param("i", $nid);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Notification deleted."]);
        }
    }

} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid action."]);
}

$conn->close();
?>
