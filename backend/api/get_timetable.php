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

$timetable = array();

$sql = "SELECT 
            t.id, 
            t.course_id, 
            c.course_name, 
            c.course_code, 
            t.lecturer_id, 
            u.full_name as lecturer_name, 
            t.day_of_week, 
            t.start_time, 
            t.end_time 
        FROM timetable t
        JOIN courses c ON t.course_id = c.id
        JOIN users u ON t.lecturer_id = u.id
        ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time ASC";

$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $timetable[] = $row;
        }
        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $timetable]);
    } else {
        http_response_code(200);
        echo json_encode(["status" => "success", "data" => [], "message" => "No timetable entries found."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database query failed: " . $conn->error]);
}

$conn->close();
?>
