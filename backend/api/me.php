<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['message' => 'Method not allowed.'], 405);
}

$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    json_response(['message' => 'Not authenticated.'], 401);
}

$stmt = db()->prepare(
    'SELECT id, name, email, role, title
     FROM users
     WHERE id = :id AND is_active = 1
     LIMIT 1'
);
$stmt->execute(['id' => $userId]);
$user = $stmt->fetch();

if (!$user) {
    unset($_SESSION['user_id']);
    json_response(['message' => 'Not authenticated.'], 401);
}

json_response(['user' => public_user($user)]);
