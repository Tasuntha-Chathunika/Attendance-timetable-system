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
    !empty($data->date) &&
    !empty($data->attendance) &&
    is_array($data->attendance)
) {
    $course_id = intval($data->course_id);
    $date = htmlspecialchars(strip_tags($data->date));
    $attendance_records = $data->attendance;

    $success_count = 0;
    $error_count = 0;

    $stmt_check = $conn->prepare("SELECT id FROM attendance WHERE student_id = ? AND course_id = ? AND date = ?");
    $stmt_insert = $conn->prepare("INSERT INTO attendance (student_id, course_id, date, status) VALUES (?, ?, ?, ?)");
    $stmt_update = $conn->prepare("UPDATE attendance SET status = ? WHERE id = ?");

    foreach ($attendance_records as $record) {
        if (isset($record->student_id) && isset($record->status)) {
            $student_id = intval($record->student_id);
            $status = htmlspecialchars(strip_tags($record->status));

            // Check if record exists
            $stmt_check->bind_param("iis", $student_id, $course_id, $date);
            $stmt_check->execute();
            $stmt_check->store_result();

            if ($stmt_check->num_rows > 0) {
                // Update
                $stmt_check->bind_result($attendance_id);
                $stmt_check->fetch();
                
                $stmt_update->bind_param("si", $status, $attendance_id);
                if ($stmt_update->execute()) {
                    $success_count++;
                } else {
                    $error_count++;
                }
            } else {
                // Insert
                $stmt_insert->bind_param("iiss", $student_id, $course_id, $date, $status);
                if ($stmt_insert->execute()) {
                    $success_count++;
                } else {
                    $error_count++;
                }
            }
        }
    }

    $stmt_check->close();
    $stmt_insert->close();
    $stmt_update->close();

    http_response_code(200);
    echo json_encode([
        "status" => "success", 
        "message" => "Attendance saved successfully.",
        "details" => [
            "saved" => $success_count,
            "failed" => $error_count
        ]
    ]);
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid or incomplete data provided."]);
}

$conn->close();
?>
