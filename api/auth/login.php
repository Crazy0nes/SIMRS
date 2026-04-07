<?php
require_once '../config.php';

// Ambil input JSON dari React
$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] == 'POST' || isset($_POST['username'])) {
    
    // Support baik form-data maupun JSON payload
    $username = $conn->real_escape_string(isset($data->username) ? $data->username : $_POST['username']);
    $password = $conn->real_escape_string(isset($data->password) ? $data->password : $_POST['password']);
    
    $result = $conn->query("SELECT * FROM users WHERE username='$username' AND password='$password'");
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['username'] = $user['username'];
        
        echo json_encode([
            'status' => 'success',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Username atau password salah!'
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
