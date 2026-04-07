<?php
require_once '../config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'pasien') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit();
}

$pasien_id = $_SESSION['user_id'];
$p = $conn->query("SELECT id, nama_lengkap FROM pasien WHERE user_id='$pasien_id'")->fetch_assoc();

if (!$p) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Data pasien tidak ditemukan']);
    exit();
}

$real_pasien_id = $p['id'];
$nama = $p['nama_lengkap'];

$today = date('Y-m-d');

// GET request untuk mengambil data antrean
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $antrean = $conn->query("SELECT * FROM antrean WHERE pasien_id='$real_pasien_id' AND tanggal='$today'");
    $status_antrean = $antrean->num_rows > 0 ? $antrean->fetch_assoc() : null;

    echo json_encode([
        'status' => 'success',
        'data' => [
            'id_pasien' => $real_pasien_id,
            'nama' => $nama,
            'antrean_hari_ini' => $status_antrean
        ]
    ]);
    exit();
}

// POST request untuk ambil antrean baru
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $action = $data->action ?? ($_POST['action'] ?? '');
    
    if ($action === 'ambil_antrean') {
        $antrean = $conn->query("SELECT * FROM antrean WHERE pasien_id='$real_pasien_id' AND tanggal='$today'");
        if ($antrean->num_rows == 0) {
            $last = $conn->query("SELECT MAX(no_antrean) as max_no FROM antrean WHERE tanggal='$today'")->fetch_assoc();
            $no_baru = $last['max_no'] ? $last['max_no'] + 1 : 1;
            
            $conn->query("INSERT INTO antrean (pasien_id, tanggal, no_antrean, status) VALUES ('$real_pasien_id', '$today', '$no_baru', 'menunggu')");
            
            $newAntrean = $conn->query("SELECT * FROM antrean WHERE pasien_id='$real_pasien_id' AND tanggal='$today'")->fetch_assoc();
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Antrean berhasil diambil',
                'antrean' => $newAntrean
            ]);
            exit();
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Anda sudah mengambil antrean hari ini']);
            exit();
        }
    }
}

http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
?>
