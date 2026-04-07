<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // Fallback if data is JSON (although json doesn't support file uploads easily, we'll keep both)
    $isJson = isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false;
    if ($isJson) {
        $data = json_decode(file_get_contents("php://input"));
        $username = $conn->real_escape_string($data->username ?? '');
        $password = $conn->real_escape_string($data->password ?? '');
        $nama_lengkap = $conn->real_escape_string($data->nama_lengkap ?? '');
        $nik = $conn->real_escape_string($data->nik ?? '');
        $no_bpjs = $conn->real_escape_string($data->no_bpjs ?? '');
    } else {
        $username = $conn->real_escape_string($_POST['username'] ?? '');
        $password = $conn->real_escape_string($_POST['password'] ?? '');
        $nama_lengkap = $conn->real_escape_string($_POST['nama_lengkap'] ?? '');
        $nik = $conn->real_escape_string($_POST['nik'] ?? '');
        $no_bpjs = $conn->real_escape_string($_POST['no_bpjs'] ?? '');
    }

    if (!$username || !$password || !$nama_lengkap || !$nik) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Lengkapi form wajib!']);
        exit();
    }
    
    // Cek username tersedia
    $check = $conn->query("SELECT id FROM users WHERE username='$username'");
    if ($check->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Username sudah digunakan!']);
        exit();
    }
    
    // File Upload handling (if sent via multipart)
    $upload_dir = '../../uploads/identitas/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $dokumen_ktp = '';
    if (isset($_FILES['dokumen_ktp']) && $_FILES['dokumen_ktp']['error'] == 0) {
        $dokumen_ktp = time() . '_ktp_' . $_FILES['dokumen_ktp']['name'];
        move_uploaded_file($_FILES['dokumen_ktp']['tmp_name'], $upload_dir . $dokumen_ktp);
    }

    $dokumen_bpjs = '';
    if (isset($_FILES['dokumen_bpjs']) && $_FILES['dokumen_bpjs']['error'] == 0) {
        $dokumen_bpjs = time() . '_bpjs_' . $_FILES['dokumen_bpjs']['name'];
        move_uploaded_file($_FILES['dokumen_bpjs']['tmp_name'], $upload_dir . $dokumen_bpjs);
    }

    // Insert to Users
    $conn->query("INSERT INTO users (username, password, role) VALUES ('$username', '$password', 'pasien')");
    $user_id = $conn->insert_id;

    // Insert to Pasien
    $conn->query("INSERT INTO pasien (user_id, nama_lengkap, nik, no_bpjs, dokumen_ktp, dokumen_bpjs) 
                  VALUES ('$user_id', '$nama_lengkap', '$nik', '$no_bpjs', '$dokumen_ktp', '$dokumen_bpjs')");
    
    echo json_encode([
        'status' => 'success', 
        'message' => 'Pendaftaran berhasil! Silakan login.'
    ]);
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
