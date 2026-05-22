<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

if (isset($_GET['lecturer_id'])) {
    $lecturer_id = intval($_GET['lecturer_id']);

    $classes = array();

    // Fetch classes assigned to this specific lecturer
    $sql = "SELECT 
                t.id as timetable_id, 
                t.course_id, 
                c.course_name, 
                c.course_code, 
                t.day_of_week, 
                t.start_time, 
                t.end_time 
            FROM timetable t
            JOIN courses c ON t.course_id = c.id
            WHERE t.lecturer_id = ?
            ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time ASC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $lecturer_id);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $classes[] = $row;
            }
            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $classes]);
        } else {
            http_response_code(200);
            echo json_encode(["status" => "success", "data" => [], "message" => "No classes scheduled."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database query failed."]);
    }

    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing lecturer ID."]);
}

$conn->close();
?>
