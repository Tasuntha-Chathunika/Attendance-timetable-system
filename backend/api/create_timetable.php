<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->course_id) && 
    !empty($data->lecturer_id) && 
    !empty($data->day_of_week) && 
    !empty($data->start_time) && 
    !empty($data->end_time)
) {
    $course_id = intval($data->course_id);
    $lecturer_id = intval($data->lecturer_id);
    $day_of_week = htmlspecialchars(strip_tags($data->day_of_week));
    $start_time = htmlspecialchars(strip_tags($data->start_time));
    $end_time = htmlspecialchars(strip_tags($data->end_time));

    // Validate that end_time is after start_time
    if (strtotime($start_time) >= strtotime($end_time)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "End time must be after start time."]);
        $conn->close();
        exit();
    }

    // Check for timetable conflicts for the lecturer
    $conflict_stmt = $conn->prepare("SELECT id FROM timetable WHERE lecturer_id = ? AND day_of_week = ? AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))");
    $conflict_stmt->bind_param("isssss", $lecturer_id, $day_of_week, $end_time, $start_time, $end_time, $start_time);
    $conflict_stmt->execute();
    $conflict_stmt->store_result();

    if ($conflict_stmt->num_rows > 0) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "Lecturer already has a class scheduled during this time."]);
        $conflict_stmt->close();
        $conn->close();
        exit();
    }
    $conflict_stmt->close();

    $stmt = $conn->prepare("INSERT INTO timetable (course_id, lecturer_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iisss", $course_id, $lecturer_id, $day_of_week, $start_time, $end_time);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Timetable entry created successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to create timetable entry."]);
    }

    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data. Please fill all fields."]);
}

$conn->close();
?>
