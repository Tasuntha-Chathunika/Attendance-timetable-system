<?php
// Rooms CRUD API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $rooms = [];
    $result = $conn->query("SELECT * FROM rooms ORDER BY room_name ASC");
    while ($row = $result->fetch_assoc()) {
        $rooms[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $rooms]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->action)) {
        
        if ($data->action === 'add' && !empty($data->room_name)) {
            $name = htmlspecialchars(strip_tags($data->room_name));
            $building = !empty($data->building) ? htmlspecialchars(strip_tags($data->building)) : null;
            $capacity = !empty($data->capacity) ? intval($data->capacity) : 0;
            
            $stmt = $conn->prepare("INSERT INTO rooms (room_name, building, capacity) VALUES (?, ?, ?)");
            $stmt->bind_param("ssi", $name, $building, $capacity);
            
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Room added successfully.", "id" => $conn->insert_id]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Failed to add room."]);
            }
            $stmt->close();
            
        } elseif ($data->action === 'update' && !empty($data->id)) {
            $id = intval($data->id);
            $name = htmlspecialchars(strip_tags($data->room_name));
            $building = !empty($data->building) ? htmlspecialchars(strip_tags($data->building)) : null;
            $capacity = !empty($data->capacity) ? intval($data->capacity) : 0;
            
            $stmt = $conn->prepare("UPDATE rooms SET room_name = ?, building = ?, capacity = ? WHERE id = ?");
            $stmt->bind_param("ssii", $name, $building, $capacity, $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Room updated."]);
            
        } elseif ($data->action === 'delete' && !empty($data->id)) {
            $id = intval($data->id);
            $stmt = $conn->prepare("DELETE FROM rooms WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Room deleted."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid request."]);
    }
}

$conn->close();
?>
