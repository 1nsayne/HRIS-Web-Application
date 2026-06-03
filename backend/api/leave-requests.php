<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/hr-helpers.php';

$user = require_user();
$pdo = db();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $employeeId = $user['role'] === 'employee' ? hr_current_employee_id($pdo, $user) : null;
        json_response(['leaveRequests' => hr_fetch_leave_rows($pdo, $employeeId)]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['message' => 'Method not allowed.'], 405);
    }

    if (!in_array($user['role'], ['admin', 'employee'], true)) {
        json_response(['message' => 'Forbidden.'], 403);
    }

    $input = json_input();
    $type = trim((string) ($input['type'] ?? ''));
    $startDate = trim((string) ($input['startDate'] ?? ''));
    $endDate = trim((string) ($input['endDate'] ?? ''));
    $reason = trim((string) ($input['reason'] ?? ''));
    $employeePublicId = trim((string) ($input['employeeId'] ?? ''));

    $validTypes = ['Vacation', 'Sick Leave', 'Personal Day', 'Maternity/Paternity'];
    if (!in_array($type, $validTypes, true) || $startDate === '' || $endDate === '' || $reason === '') {
        json_response(['message' => 'Leave type, dates, and reason are required.'], 422);
    }

    if ($user['role'] === 'employee') {
        $employeeId = hr_current_employee_id($pdo, $user);
    } else {
        $employee = $employeePublicId !== '' ? hr_employee_by_public_id($pdo, $employeePublicId) : null;
        $employeeId = $employee ? (int) $employee['id'] : hr_current_employee_id($pdo, $user);
    }

    if (!$employeeId) {
        json_response(['message' => 'Employee record was not found.'], 422);
    }

    $publicId = hr_next_public_id($pdo, 'leave_requests', 'LRQ', 3);
    $stmt = $pdo->prepare(
        'INSERT INTO leave_requests (public_id, employee_id, type, start_date, end_date, status, reason)
         VALUES (:public_id, :employee_id, :type, :start_date, :end_date, "Pending", :reason)'
    );
    $stmt->execute([
        'public_id' => $publicId,
        'employee_id' => $employeeId,
        'type' => $type,
        'start_date' => $startDate,
        'end_date' => $endDate,
        'reason' => $reason,
    ]);

    $leaveRequest = hr_fetch_leave_row($pdo, $publicId);
    json_response(['leaveRequest' => $leaveRequest], 201);
} catch (PDOException) {
    json_response(['message' => 'Unable to load or save leave requests. Make sure backend/database/schema.sql is imported.'], 500);
}
