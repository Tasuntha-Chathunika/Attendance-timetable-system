<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (
    isset($data->id) && 
    isset($data->full_name) && 
    isset($data->username) && 
    isset($data->email) && 
    isset($data->role) &&
    isset($data->admin_id)
) {
    $id = intval($data->id);
    $admin_id = intval($data->admin_id);
    
    // Check if the request is from an admin
    $admin_check = "SELECT role FROM users WHERE id = $admin_id LIMIT 1";
    $admin_result = mysqli_query($conn, $admin_check);
    if (mysqli_num_rows($admin_result) > 0) {
        $admin = mysqli_fetch_assoc($admin_result);
        if ($admin['role'] !== 'admin') {
            echo json_encode(["status" => "error", "message" => "Unauthorized access."]);
            exit();
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Admin user not found."]);
        exit();
    }

    $full_name = mysqli_real_escape_string($conn, trim($data->full_name));
    $username = mysqli_real_escape_string($conn, trim($data->username));
    $email = mysqli_real_escape_string($conn, trim($data->email));
    $role = mysqli_real_escape_string($conn, $data->role);

    // Check if username or email already exists for another user
    $check_query = "SELECT id FROM users WHERE (username = '$username' OR email = '$email') AND id != $id LIMIT 1";
    $check_result = mysqli_query($conn, $check_query);

    if (mysqli_num_rows($check_result) > 0) {
        echo json_encode(["status" => "error", "message" => "Username or Email already exists for another user!"]);
    } else {
        // Optional password update
        $password_sql = "";
        if (isset($data->password) && !empty($data->password)) {
            $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
            $password_sql = ", password = '$hashed_password'";
        }

        $update_query = "UPDATE users SET full_name = '$full_name', username = '$username', email = '$email', role = '$role' $password_sql WHERE id = $id";
        
        if (mysqli_query($conn, $update_query)) {
            // Log the action
            $details = "Updated user ID: $id ($username). Role: $role";
            $log_query = "INSERT INTO audit_log (user_id, action, details) VALUES ($admin_id, 'edit_user', '$details')";
            mysqli_query($conn, $log_query);

            echo json_encode(["status" => "success", "message" => "User updated successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update user: " . mysqli_error($conn)]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "Incomplete data provided."]);
}

mysqli_close($conn);
?>
