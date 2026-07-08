<?php
// Admin Dashboard Statistics API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include_once '../config/database.php';

// Total counts
$total_users = $conn->query("SELECT COUNT(*) as count FROM users")->fetch_assoc()['count'];
$total_students = $conn->query("SELECT COUNT(*) as count FROM users WHERE role='student'")->fetch_assoc()['count'];
$total_lecturers = $conn->query("SELECT COUNT(*) as count FROM users WHERE role='lecturer'")->fetch_assoc()['count'];
$total_courses = $conn->query("SELECT COUNT(*) as count FROM courses")->fetch_assoc()['count'];
$total_classes_today = 0;

$today_name = date('l'); // e.g. "Monday"
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM timetable WHERE day_of_week = ?");
$stmt->bind_param("s", $today_name);
$stmt->execute();
$result = $stmt->get_result();
$total_classes_today = $result->fetch_assoc()['count'];
$stmt->close();

// Attendance trend last 7 days
$trend = [];
for ($i = 6; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-$i days"));
    $day_label = date('D', strtotime("-$i days"));
    
    $total = $conn->query("SELECT COUNT(*) as c FROM attendance WHERE date = '$date'")->fetch_assoc()['c'];
    $present = $conn->query("SELECT COUNT(*) as c FROM attendance WHERE date = '$date' AND status IN ('present','late')")->fetch_assoc()['c'];
    
    $trend[] = [
        'date' => $date,
        'day' => $day_label,
        'total' => (int)$total,
        'present' => (int)$present,
        'percentage' => $total > 0 ? round(($present / $total) * 100) : 0
    ];
}

// Recently registered users (last 5)
$recent_users = [];
$result = $conn->query("SELECT id, full_name, role, created_at FROM users ORDER BY created_at DESC LIMIT 5");
while ($row = $result->fetch_assoc()) {
    $recent_users[] = $row;
}

// Top attended courses
$top_courses = [];
$result = $conn->query("
    SELECT c.course_name, c.course_code,
        COUNT(a.id) as total_records,
        SUM(CASE WHEN a.status IN ('present','late') THEN 1 ELSE 0 END) as attended
    FROM courses c
    LEFT JOIN attendance a ON c.id = a.course_id
    GROUP BY c.id
    ORDER BY attended DESC
    LIMIT 5
");
while ($row = $result->fetch_assoc()) {
    $row['percentage'] = $row['total_records'] > 0 ? round(($row['attended'] / $row['total_records']) * 100) : 0;
    $top_courses[] = $row;
}

// Low attendance students (below 75%)
$low_attendance = [];
$result = $conn->query("
    SELECT u.id, u.full_name, u.email,
        COUNT(a.id) as total,
        SUM(CASE WHEN a.status IN ('present','late') THEN 1 ELSE 0 END) as attended
    FROM users u
    LEFT JOIN attendance a ON u.id = a.student_id
    WHERE u.role = 'student'
    GROUP BY u.id
    HAVING total > 0 AND (attended / total * 100) < 75
    ORDER BY (attended / total) ASC
    LIMIT 10
");
while ($row = $result->fetch_assoc()) {
    $row['percentage'] = round(($row['attended'] / $row['total']) * 100);
    $low_attendance[] = $row;
}

echo json_encode([
    "status" => "success",
    "data" => [
        "counts" => [
            "total_users" => (int)$total_users,
            "total_students" => (int)$total_students,
            "total_lecturers" => (int)$total_lecturers,
            "total_courses" => (int)$total_courses,
            "classes_today" => (int)$total_classes_today
        ],
        "attendance_trend" => $trend,
        "recent_users" => $recent_users,
        "top_courses" => $top_courses,
        "low_attendance_students" => $low_attendance
    ]
]);

$conn->close();
?>
