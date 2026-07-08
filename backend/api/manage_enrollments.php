<?php
// Enrollments API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $enrollments = [];
    
    if (isset($_GET['student_id'])) {
        // Get enrollments for a student
        $sid = intval($_GET['student_id']);
        $stmt = $conn->prepare("SELECT e.*, c.course_name, c.course_code FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ? ORDER BY e.enrolled_at DESC");
        $stmt->bind_param("i", $sid);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) $enrollments[] = $row;
        $stmt->close();
    } elseif (isset($_GET['all'])) {
        // Get all enrollments (admin view)
        $result = $conn->query("SELECT e.*, c.course_name, c.course_code, u.full_name as student_name FROM enrollments e JOIN courses c ON e.course_id = c.id JOIN users u ON e.student_id = u.id ORDER BY e.enrolled_at DESC");
        while ($row = $result->fetch_assoc()) $enrollments[] = $row;
    }
    
    echo json_encode(["status" => "success", "data" => $enrollments]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->action)) {
        
        if ($data->action === 'enroll' && !empty($data->student_id) && !empty($data->course_id)) {
            $sid = intval($data->student_id);
            $cid = intval($data->course_id);
            
            // Check duplicate
            $check = $conn->prepare("SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?");
            $check->bind_param("ii", $sid, $cid);
            $check->execute();
            $check->store_result();
            if ($check->num_rows > 0) {
                echo json_encode(["status" => "error", "message" => "Already enrolled in this course."]);
                $check->close();
                $conn->close();
                exit();
            }
            $check->close();
            
            $stmt = $conn->prepare("INSERT INTO enrollments (student_id, course_id, status) VALUES (?, ?, 'pending')");
            $stmt->bind_param("ii", $sid, $cid);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Enrollment request submitted."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to enroll."]);
            }
            $stmt->close();
            
        } elseif ($data->action === 'approve' && !empty($data->id)) {
            $id = intval($data->id);
            $stmt = $conn->prepare("UPDATE enrollments SET status = 'approved' WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Enrollment approved."]);
            
        } elseif ($data->action === 'reject' && !empty($data->id)) {
            $id = intval($data->id);
            $stmt = $conn->prepare("UPDATE enrollments SET status = 'rejected' WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Enrollment rejected."]);
            
        } elseif ($data->action === 'delete' && !empty($data->id)) {
            $id = intval($data->id);
            $stmt = $conn->prepare("DELETE FROM enrollments WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Enrollment deleted."]);
        }
    }
}

$conn->close();
?>
