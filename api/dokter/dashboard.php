<?php
require_once '../config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'dokter') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit();
}

$today = date('Y-m-d');

// GET request untuk daftar antrean
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $antrean_query = $conn->query("
        SELECT a.id as antrean_id, a.no_antrean, p.id as patient_id, p.nama_lengkap, a.status 
        FROM antrean a 
        JOIN pasien p ON a.pasien_id = p.id 
        WHERE a.tanggal = '$today' AND a.status IN ('menunggu', 'diperiksa')
        ORDER BY a.no_antrean ASC
    ");

    $data = [];
    if ($antrean_query) {
        while($row = $antrean_query->fetch_assoc()) {
            $data[] = $row;
        }
    }

    echo json_encode([
        'status' => 'success',
        'data' => $data
    ]);
    exit();
}

// POST request untuk periksa (ubah status)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $payload = json_decode(file_get_contents("php://input"));
    $action = $payload->action ?? ($_POST['action'] ?? '');
    
    if ($action === 'periksa') {
        $a_id = (int)($payload->antrean_id ?? $_POST['antrean_id']);
        if ($a_id) {
            $conn->query("UPDATE antrean SET status='diperiksa' WHERE id='$a_id'");
            echo json_encode([
                'status' => 'success',
                'message' => 'Status diubah menjadi diperiksa',
                'antrean_id' => $a_id
            ]);
            exit();
        }
    }
}

http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
?>
