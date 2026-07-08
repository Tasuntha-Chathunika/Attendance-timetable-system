<?php
// Events / Academic Calendar API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $events = [];
    
    // Optional filters
    $where = "1=1";
    if (isset($_GET['month']) && isset($_GET['year'])) {
        $month = intval($_GET['month']);
        $year = intval($_GET['year']);
        $where .= " AND MONTH(event_date) = $month AND YEAR(event_date) = $year";
    }
    if (isset($_GET['type'])) {
        $type = $conn->real_escape_string($_GET['type']);
        $where .= " AND event_type = '$type'";
    }
    
    $result = $conn->query("SELECT e.*, u.full_name as creator_name FROM events e JOIN users u ON e.created_by = u.id WHERE $where ORDER BY event_date ASC");
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $events]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->action)) {
        
        if ($data->action === 'add') {
            if (!empty($data->title) && !empty($data->event_date) && !empty($data->created_by)) {
                $title = htmlspecialchars(strip_tags($data->title));
                $desc = !empty($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;
                $date = htmlspecialchars(strip_tags($data->event_date));
                $type = !empty($data->event_type) ? htmlspecialchars(strip_tags($data->event_type)) : 'event';
                $created_by = intval($data->created_by);
                
                $stmt = $conn->prepare("INSERT INTO events (title, description, event_date, event_type, created_by) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssi", $title, $desc, $date, $type, $created_by);
                
                if ($stmt->execute()) {
                    echo json_encode(["status" => "success", "message" => "Event added.", "id" => $conn->insert_id]);
                } else {
                    http_response_code(500);
                    echo json_encode(["status" => "error", "message" => "Failed to add event."]);
                }
                $stmt->close();
            } else {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Title, date, and creator required."]);
            }
            
        } elseif ($data->action === 'update' && !empty($data->id)) {
            $id = intval($data->id);
            $title = htmlspecialchars(strip_tags($data->title));
            $desc = !empty($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;
            $date = htmlspecialchars(strip_tags($data->event_date));
            $type = !empty($data->event_type) ? htmlspecialchars(strip_tags($data->event_type)) : 'event';
            
            $stmt = $conn->prepare("UPDATE events SET title=?, description=?, event_date=?, event_type=? WHERE id=?");
            $stmt->bind_param("ssssi", $title, $desc, $date, $type, $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Event updated."]);
            
        } elseif ($data->action === 'delete' && !empty($data->id)) {
            $id = intval($data->id);
            $stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Event deleted."]);
        }
    }
}

$conn->close();
?>
