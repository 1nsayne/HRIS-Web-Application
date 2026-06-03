<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/hr-helpers.php';

$user = require_role('employee');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['message' => 'Method not allowed.'], 405);
}

$pdo = db();
$input = json_input();
$action = trim((string) ($input['action'] ?? ''));

if (!in_array($action, ['in', 'out'], true)) {
    json_response(['message' => 'Punch action must be in or out.'], 422);
}

try {
    $employeeId = hr_current_employee_id($pdo, $user);
    if (!$employeeId) {
        json_response(['message' => 'Employee record was not found.'], 422);
    }

    $today = date('Y-m-d');
    $now = date('H:i:s');
    $find = $pdo->prepare('SELECT id, public_id, check_in, check_out FROM attendance_logs WHERE employee_id = :employee_id AND work_date = :work_date LIMIT 1');
    $find->execute([
        'employee_id' => $employeeId,
        'work_date' => $today,
    ]);
    $existing = $find->fetch();

    if ($action === 'in') {
        $status = $now > '09:00:00' ? 'Late' : 'On Time';

        if ($existing) {
            $stmt = $pdo->prepare('UPDATE attendance_logs SET check_in = COALESCE(check_in, :check_in), status = :status WHERE id = :id');
            $stmt->execute([
                'check_in' => $now,
                'status' => $status,
                'id' => $existing['id'],
            ]);
            $publicId = $existing['public_id'];
        } else {
            $publicId = hr_next_public_id($pdo, 'attendance_logs', 'ATT', 3);
            $stmt = $pdo->prepare(
                'INSERT INTO attendance_logs (public_id, employee_id, work_date, check_in, check_out, status, shift)
                 VALUES (:public_id, :employee_id, :work_date, :check_in, NULL, :status, "Day Shift")'
            );
            $stmt->execute([
                'public_id' => $publicId,
                'employee_id' => $employeeId,
                'work_date' => $today,
                'check_in' => $now,
                'status' => $status,
            ]);
        }

        json_response([
            'attendanceLog' => hr_fetch_attendance_row($pdo, $publicId),
            'isPunchIn' => true,
            'punchTime' => hr_time_label($now),
        ]);
    }

    if (!$existing) {
        json_response(['message' => 'No open punch-in record was found for today.'], 422);
    }

    $stmt = $pdo->prepare('UPDATE attendance_logs SET check_out = :check_out WHERE id = :id');
    $stmt->execute([
        'check_out' => $now,
        'id' => $existing['id'],
    ]);

    json_response([
        'attendanceLog' => hr_fetch_attendance_row($pdo, $existing['public_id']),
        'isPunchIn' => false,
        'punchTime' => null,
    ]);
} catch (PDOException) {
    json_response(['message' => 'Unable to save punch record. Make sure backend/database/schema.sql is imported.'], 500);
}
