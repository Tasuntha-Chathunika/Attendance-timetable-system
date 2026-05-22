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

if (isset($_GET['course_id']) && isset($_GET['date'])) {
    $course_id = intval($_GET['course_id']);
    $date = htmlspecialchars(strip_tags($_GET['date']));

    $attendance = array();

    $sql = "SELECT student_id, status FROM attendance WHERE course_id = ? AND date = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $course_id, $date);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $attendance[] = $row;
        }
        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $attendance]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database query failed."]);
    }

    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing course_id or date."]);
}

$conn->close();
?>
