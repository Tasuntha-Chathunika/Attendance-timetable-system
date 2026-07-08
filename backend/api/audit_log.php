<?php
// Audit Log API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $logs = [];
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    
    $result = $conn->query("
        SELECT al.*, u.full_name as user_name, u.role as user_role
        FROM audit_log al 
        LEFT JOIN users u ON al.user_id = u.id 
        ORDER BY al.created_at DESC 
        LIMIT $limit
    ");
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $logs]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->action_name)) {
        $user_id = !empty($data->user_id) ? intval($data->user_id) : null;
        $action = htmlspecialchars(strip_tags($data->action_name));
        $details = !empty($data->details) ? htmlspecialchars(strip_tags($data->details)) : null;
        $ip = $_SERVER['REMOTE_ADDR'] ?? null;
        
        $stmt = $conn->prepare("INSERT INTO audit_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $user_id, $action, $details, $ip);
        $stmt->execute();
        $stmt->close();
        
        echo json_encode(["status" => "success", "message" => "Log entry created."]);
    }
}

$conn->close();
?>
