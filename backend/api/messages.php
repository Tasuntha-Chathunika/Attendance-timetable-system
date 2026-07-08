<?php
// Messages API (Direct messaging)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id'])) {
        $uid = intval($_GET['user_id']);
        
        if (isset($_GET['conversation_with'])) {
            // Get specific conversation
            $other = intval($_GET['conversation_with']);
            $stmt = $conn->prepare("
                SELECT m.*, 
                    s.full_name as sender_name, s.role as sender_role,
                    r.full_name as receiver_name, r.role as receiver_role
                FROM messages m
                JOIN users s ON m.sender_id = s.id
                JOIN users r ON m.receiver_id = r.id
                WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
                ORDER BY m.created_at ASC
            ");
            $stmt->bind_param("iiii", $uid, $other, $other, $uid);
            $stmt->execute();
            $result = $stmt->get_result();
            $messages = [];
            while ($row = $result->fetch_assoc()) $messages[] = $row;
            $stmt->close();
            
            // Mark as read
            $stmt2 = $conn->prepare("UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0");
            $stmt2->bind_param("ii", $other, $uid);
            $stmt2->execute();
            $stmt2->close();
            
            echo json_encode(["status" => "success", "data" => $messages]);
        } else {
            // Get conversation list (unique contacts with last message)
            $conversations = [];
            $result = $conn->query("
                SELECT 
                    CASE WHEN m.sender_id = $uid THEN m.receiver_id ELSE m.sender_id END as contact_id,
                    CASE WHEN m.sender_id = $uid THEN r.full_name ELSE s.full_name END as contact_name,
                    CASE WHEN m.sender_id = $uid THEN r.role ELSE s.role END as contact_role,
                    m.message as last_message,
                    m.created_at as last_time,
                    (SELECT COUNT(*) FROM messages WHERE sender_id = CASE WHEN m.sender_id = $uid THEN m.receiver_id ELSE m.sender_id END AND receiver_id = $uid AND is_read = 0) as unread_count
                FROM messages m
                JOIN users s ON m.sender_id = s.id
                JOIN users r ON m.receiver_id = r.id
                WHERE m.sender_id = $uid OR m.receiver_id = $uid
                GROUP BY contact_id
                ORDER BY m.created_at DESC
            ");
            while ($row = $result->fetch_assoc()) $conversations[] = $row;
            echo json_encode(["status" => "success", "data" => $conversations]);
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->sender_id) && !empty($data->receiver_id) && !empty($data->message)) {
        $sender = intval($data->sender_id);
        $receiver = intval($data->receiver_id);
        $msg = htmlspecialchars(strip_tags($data->message));
        
        $stmt = $conn->prepare("INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $sender, $receiver, $msg);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Message sent.", "id" => $conn->insert_id]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to send message."]);
        }
        $stmt->close();
    }
}

$conn->close();
?>
