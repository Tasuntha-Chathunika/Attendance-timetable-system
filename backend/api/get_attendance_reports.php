<?php
// Attendance Reports API (Admin)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

$report_type = isset($_GET['type']) ? $_GET['type'] : 'overview';

if ($report_type === 'overview') {
    // Overall attendance summary by course
    $courses = [];
    $result = $conn->query("
        SELECT c.id, c.course_name, c.course_code,
            COUNT(a.id) as total_records,
            SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent,
            SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late
        FROM courses c
        LEFT JOIN attendance a ON c.id = a.course_id
        GROUP BY c.id
        ORDER BY c.course_name
    ");
    while ($row = $result->fetch_assoc()) {
        $row['percentage'] = $row['total_records'] > 0 ? round((($row['present'] + $row['late']) / $row['total_records']) * 100) : 0;
        $courses[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $courses]);

} elseif ($report_type === 'course' && isset($_GET['course_id'])) {
    // Detailed report for a specific course
    $cid = intval($_GET['course_id']);
    $date_from = isset($_GET['from']) ? $_GET['from'] : null;
    $date_to = isset($_GET['to']) ? $_GET['to'] : null;
    
    $where_date = "";
    if ($date_from && $date_to) {
        $from = $conn->real_escape_string($date_from);
        $to = $conn->real_escape_string($date_to);
        $where_date = " AND a.date BETWEEN '$from' AND '$to'";
    }
    
    // Student-wise breakdown
    $students = [];
    $result = $conn->query("
        SELECT u.id, u.full_name, u.email,
            COUNT(a.id) as total,
            SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent,
            SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late
        FROM users u
        JOIN attendance a ON u.id = a.student_id AND a.course_id = $cid $where_date
        WHERE u.role = 'student'
        GROUP BY u.id
        ORDER BY u.full_name
    ");
    while ($row = $result->fetch_assoc()) {
        $row['percentage'] = $row['total'] > 0 ? round((($row['present'] + $row['late']) / $row['total']) * 100) : 0;
        $students[] = $row;
    }
    
    // Daily attendance count for chart
    $daily = [];
    $result2 = $conn->query("
        SELECT a.date,
            COUNT(a.id) as total,
            SUM(CASE WHEN a.status IN ('present','late') THEN 1 ELSE 0 END) as attended
        FROM attendance a
        WHERE a.course_id = $cid $where_date
        GROUP BY a.date
        ORDER BY a.date DESC
        LIMIT 30
    ");
    while ($row = $result2->fetch_assoc()) {
        $row['percentage'] = $row['total'] > 0 ? round(($row['attended'] / $row['total']) * 100) : 0;
        $daily[] = $row;
    }
    
    echo json_encode(["status" => "success", "data" => ["students" => $students, "daily" => array_reverse($daily)]]);

} elseif ($report_type === 'student' && isset($_GET['student_id'])) {
    // Detailed report for a specific student
    $sid = intval($_GET['student_id']);
    $course_breakdown = [];
    
    $result = $conn->query("
        SELECT c.id as course_id, c.course_name, c.course_code,
            COUNT(a.id) as total,
            SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent,
            SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late
        FROM attendance a
        JOIN courses c ON a.course_id = c.id
        WHERE a.student_id = $sid
        GROUP BY c.id
        ORDER BY c.course_name
    ");
    while ($row = $result->fetch_assoc()) {
        $row['percentage'] = $row['total'] > 0 ? round((($row['present'] + $row['late']) / $row['total']) * 100) : 0;
        $course_breakdown[] = $row;
    }
    
    // Monthly trend
    $monthly = [];
    $result2 = $conn->query("
        SELECT DATE_FORMAT(a.date, '%Y-%m') as month,
            COUNT(a.id) as total,
            SUM(CASE WHEN a.status IN ('present','late') THEN 1 ELSE 0 END) as attended
        FROM attendance a
        WHERE a.student_id = $sid
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
    ");
    while ($row = $result2->fetch_assoc()) {
        $row['percentage'] = $row['total'] > 0 ? round(($row['attended'] / $row['total']) * 100) : 0;
        $monthly[] = $row;
    }
    
    echo json_encode(["status" => "success", "data" => ["courses" => $course_breakdown, "monthly" => array_reverse($monthly)]]);

} elseif ($report_type === 'lecturer' && isset($_GET['lecturer_id'])) {
    // Lecturer's courses attendance report
    $lid = intval($_GET['lecturer_id']);
    
    $courses = [];
    $result = $conn->query("
        SELECT c.id, c.course_name, c.course_code, t.day_of_week, t.start_time, t.end_time,
            (SELECT COUNT(*) FROM attendance WHERE course_id = c.id) as total_records,
            (SELECT SUM(CASE WHEN status IN ('present','late') THEN 1 ELSE 0 END) FROM attendance WHERE course_id = c.id) as attended
        FROM timetable t
        JOIN courses c ON t.course_id = c.id
        WHERE t.lecturer_id = $lid
        ORDER BY c.course_name
    ");
    while ($row = $result->fetch_assoc()) {
        $row['percentage'] = $row['total_records'] > 0 ? round(($row['attended'] / $row['total_records']) * 100) : 0;
        $courses[] = $row;
    }
    
    echo json_encode(["status" => "success", "data" => $courses]);
}

$conn->close();
?>
