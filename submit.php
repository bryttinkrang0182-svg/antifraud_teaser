<?php
// CORS headers for React frontend
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

// GET action=count -> return current count
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = isset($_GET['action']) ? $_GET['action'] : null;
    if ($action === 'count') {
        try {
            $count = $pdo->query('SELECT COUNT(*) FROM victims')->fetchColumn();
            echo json_encode(['success' => true, 'count' => (int)$count]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        exit;
    }
}

// Otherwise expect POST for insert
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Read input
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : null;
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : null;
$dob = isset($_POST['dateOfBirth']) ? trim($_POST['dateOfBirth']) : null;
$lastFour = isset($_POST['lastFourDigits']) ? trim($_POST['lastFourDigits']) : null;

// validate name
if ($name === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name is required']);
    exit;
}

// normalize/validate date value: accept YYYY-MM-DD (from HTML date input). If invalid, set null.
if ($dob !== null && $dob !== '') {
    $d = DateTime::createFromFormat('Y-m-d', $dob);
    if ($d && $d->format('Y-m-d') === $dob) {
        // ok
    } else {
        // try to parse other common formats and convert
        try {
            $tmp = new DateTime($dob);
            $dob = $tmp->format('Y-m-d');
        } catch (Exception $ex) {
            // invalid date, set to null so DB insert won't fail
            $dob = null;
        }
    }
}

try {
    $stmt = $pdo->prepare('INSERT INTO victims (name, email, phone, dob, last_four) VALUES (:name, :email, :phone, :dob, :last_four)');
    $stmt->bindValue(':name', $name);
    $stmt->bindValue(':email', $email ?: null, PDO::PARAM_STR);
    $stmt->bindValue(':phone', $phone ?: null, PDO::PARAM_STR);
    if ($dob === null || $dob === '') {
        $stmt->bindValue(':dob', null, PDO::PARAM_NULL);
    } else {
        $stmt->bindValue(':dob', $dob);
    }
    $stmt->bindValue(':last_four', $lastFour ?: null, PDO::PARAM_STR);
    $stmt->execute();
    $id = $pdo->lastInsertId();
    $count = $pdo->query('SELECT COUNT(*) FROM victims')->fetchColumn();
    echo json_encode(['success' => true, 'id' => (int)$id, 'count' => (int)$count]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
