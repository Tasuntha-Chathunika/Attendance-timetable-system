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

$courses = array();

$sql = "SELECT id, course_name, course_code FROM courses ORDER BY course_name ASC";
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }
        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $courses]);
    } else {
        http_response_code(200);
        echo json_encode(["status" => "success", "data" => [], "message" => "No courses found."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database query failed."]);
}

$conn->close();
?>
