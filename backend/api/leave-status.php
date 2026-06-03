<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/hr-helpers.php';

require_role('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['message' => 'Method not allowed.'], 405);
}

$input = json_input();
$id = trim((string) ($input['id'] ?? ''));
$status = trim((string) ($input['status'] ?? ''));

if ($id === '' || !in_array($status, ['Approved', 'Rejected'], true)) {
    json_response(['message' => 'Leave request id and valid status are required.'], 422);
}

try {
    $stmt = db()->prepare('UPDATE leave_requests SET status = :status WHERE public_id = :id');
    $stmt->execute([
        'status' => $status,
        'id' => $id,
    ]);

    $leaveRequest = hr_fetch_leave_row(db(), $id);
    if (!$leaveRequest) {
        json_response(['message' => 'Leave request was not found.'], 404);
    }

    json_response(['leaveRequest' => $leaveRequest]);
} catch (PDOException) {
    json_response(['message' => 'Unable to update leave request. Make sure backend/database/schema.sql is imported.'], 500);
}
