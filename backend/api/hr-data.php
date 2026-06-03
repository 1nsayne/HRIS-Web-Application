<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/hr-helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['message' => 'Method not allowed.'], 405);
}

$user = require_user();
$pdo = db();

try {
    $isEmployee = $user['role'] === 'employee';
    $employeeId = $isEmployee ? hr_current_employee_id($pdo, $user) : null;
    $canReadWorkforceData = in_array($user['role'], ['admin', 'exec'], true);

    json_response([
        'employees' => hr_fetch_employee_rows($pdo, $employeeId),
        'candidates' => hr_fetch_candidate_rows($pdo, $canReadWorkforceData),
        'leaveRequests' => hr_fetch_leave_rows($pdo, $employeeId),
        'attendanceLogs' => hr_fetch_attendance_rows($pdo, $employeeId),
        'documents' => hr_fetch_document_rows($pdo, $isEmployee),
        'payPeriods' => hr_fetch_pay_period_rows($pdo, $canReadWorkforceData),
    ]);
} catch (PDOException) {
    json_response(['message' => 'HR data tables are not ready. Import backend/database/schema.sql and try again.'], 500);
}
