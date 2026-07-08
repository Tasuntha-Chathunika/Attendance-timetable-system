<?php
// Assignments API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $assignments = [];
    
    if (isset($_GET['course_id'])) {
        $cid = intval($_GET['course_id']);
        $stmt = $conn->prepare("SELECT a.*, c.course_name, c.course_code, u.full_name as lecturer_name FROM assignments a JOIN courses c ON a.course_id = c.id JOIN users u ON a.lecturer_id = u.id WHERE a.course_id = ? ORDER BY a.due_date DESC");
        $stmt->bind_param("i", $cid);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) $assignments[] = $row;
        $stmt->close();
    } elseif (isset($_GET['lecturer_id'])) {
        $lid = intval($_GET['lecturer_id']);
        $stmt = $conn->prepare("SELECT a.*, c.course_name, c.course_code, (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) as submission_count FROM assignments a JOIN courses c ON a.course_id = c.id WHERE a.lecturer_id = ? ORDER BY a.due_date DESC");
        $stmt->bind_param("i", $lid);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) $assignments[] = $row;
        $stmt->close();
    } elseif (isset($_GET['student_id'])) {
        // Get assignments for courses the student is enrolled in / has attendance for
        $sid = intval($_GET['student_id']);
        $result = $conn->query("
            SELECT DISTINCT a.*, c.course_name, c.course_code, u.full_name as lecturer_name,
                (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id AND s.student_id = $sid) as has_submitted
            FROM assignments a
            JOIN courses c ON a.course_id = c.id
            JOIN users u ON a.lecturer_id = u.id
            WHERE a.course_id IN (
                SELECT DISTINCT course_id FROM attendance WHERE student_id = $sid
                UNION
                SELECT course_id FROM enrollments WHERE student_id = $sid AND status = 'approved'
            )
            ORDER BY a.due_date DESC
        ");
        while ($row = $result->fetch_assoc()) $assignments[] = $row;
    }
    
    echo json_encode(["status" => "success", "data" => $assignments]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->action)) {
        if ($data->action === 'create') {
            if (!empty($data->course_id) && !empty($data->lecturer_id) && !empty($data->title) && !empty($data->due_date)) {
                $cid = intval($data->course_id);
                $lid = intval($data->lecturer_id);
                $title = htmlspecialchars(strip_tags($data->title));
                $desc = !empty($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;
                $due = htmlspecialchars(strip_tags($data->due_date));
                
                $stmt = $conn->prepare("INSERT INTO assignments (course_id, lecturer_id, title, description, due_date) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("iisss", $cid, $lid, $title, $desc, $due);
                if ($stmt->execute()) {
                    echo json_encode(["status" => "success", "message" => "Assignment created.", "id" => $conn->insert_id]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Failed to create assignment."]);
                }
                $stmt->close();
            }
        } elseif ($data->action === 'delete' && !empty($data->id)) {
            $id = intval($data->id);
            $stmt = $conn->prepare("DELETE FROM assignments WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["status" => "success", "message" => "Assignment deleted."]);
        } elseif ($data->action === 'submit') {
            if (!empty($data->assignment_id) && !empty($data->student_id)) {
                $aid = intval($data->assignment_id);
                $sid = intval($data->student_id);
                $notes = !empty($data->notes) ? htmlspecialchars(strip_tags($data->notes)) : null;
                
                $stmt = $conn->prepare("INSERT INTO submissions (assignment_id, student_id, notes) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE notes = ?, submitted_at = CURRENT_TIMESTAMP");
                $stmt->bind_param("iiss", $aid, $sid, $notes, $notes);
                if ($stmt->execute()) {
                    echo json_encode(["status" => "success", "message" => "Submission recorded."]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Failed to submit."]);
                }
                $stmt->close();
            }
        }
    }
}

$conn->close();
?>
