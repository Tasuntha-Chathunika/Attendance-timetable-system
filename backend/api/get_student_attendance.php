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

if (isset($_GET['student_id'])) {
    $student_id = intval($_GET['student_id']);

    $total_classes = 0;
    $present = 0;
    $absent = 0;
    $late = 0;
    
    $records = array();

    // Fetch detailed attendance records
    $sql_records = "SELECT a.date, a.status, c.course_code, c.course_name 
                    FROM attendance a 
                    JOIN courses c ON a.course_id = c.id 
                    WHERE a.student_id = ? 
                    ORDER BY a.date DESC";
                    
    $stmt_records = $conn->prepare($sql_records);
    $stmt_records->bind_param("i", $student_id);
    
    if ($stmt_records->execute()) {
        $result = $stmt_records->get_result();
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
            $total_classes++;
            
            if ($row['status'] === 'present') {
                $present++;
            } elseif ($row['status'] === 'absent') {
                $absent++;
            } elseif ($row['status'] === 'late') {
                $late++;
            }
        }
    }
    $stmt_records->close();

    // Calculate percentage (Present + Late usually counts as attended, or maybe Late is 0.5? Let's just do Present + Late as attended)
    $attended = $present + $late;
    $percentage = $total_classes > 0 ? round(($attended / $total_classes) * 100) : 0;

    http_response_code(200);
    echo json_encode([
        "status" => "success", 
        "data" => [
            "summary" => [
                "total" => $total_classes,
                "present" => $present,
                "absent" => $absent,
                "late" => $late,
                "percentage" => $percentage
            ],
            "records" => $records
        ]
    ]);

} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing student ID."]);
}

$conn->close();
?>
