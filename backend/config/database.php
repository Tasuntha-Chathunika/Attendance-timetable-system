<?php
// XAMPP Default settings
$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "atms_db"; // Api me namata issarahata database ekak hadamu

// Create connection
$conn = new mysqli($host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error", 
        "message" => "Database connection failed: " . $conn->connect_error
    ]));
}
?>