<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['message' => 'Method not allowed.'], 405);
}

$user = require_user();
$pdo = db();

function time_label(?string $time): string
{
    if ($time === null || $time === '') {
        return '--';
    }

    $timestamp = strtotime($time);
    return $timestamp === false ? '--' : date('h:i A', $timestamp);
}

function fetch_employee_rows(PDO $pdo, ?int $employeeId = null): array
{
    $sql = "SELECT
            e.id AS internal_id,
            e.public_id,
            e.name,
            e.role_title,
            d.name AS department,
            e.status,
            e.email,
            e.phone,
            e.location,
            e.date_joined,
            e.salary,
            e.monthly_deductions,
            e.monthly_benefits,
            e.vacation_balance,
            e.sick_balance,
            e.personal_balance,
            e.performance_rating,
            e.recruitment_source,
            e.avatar_url
        FROM employees e
        INNER JOIN departments d ON d.id = e.department_id";

    $params = [];
    if ($employeeId !== null) {
        $sql .= ' WHERE e.id = :employee_id';
        $params['employee_id'] = $employeeId;
    }

    $sql .= ' ORDER BY e.public_id ASC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    return array_map(static function (array $row): array {
        return [
            'id' => $row['public_id'],
            'name' => $row['name'],
            'role' => $row['role_title'],
            'department' => $row['department'],
            'status' => $row['status'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'location' => $row['location'],
            'dateJoined' => $row['date_joined'],
            'salary' => (float) $row['salary'],
            'deductions' => (float) $row['monthly_deductions'],
            'benefits' => (float) $row['monthly_benefits'],
            'leaveBalances' => [
                'vacation' => (int) $row['vacation_balance'],
                'sick' => (int) $row['sick_balance'],
                'personal' => (int) $row['personal_balance'],
            ],
            'performanceRating' => (float) $row['performance_rating'],
            'recruitmentSource' => $row['recruitment_source'],
            'avatar' => $row['avatar_url'],
        ];
    }, $stmt->fetchAll());
}

function fetch_candidate_rows(PDO $pdo, bool $includeCandidates): array
{
    if (!$includeCandidates) {
        return [];
    }

    $stmt = $pdo->query(
        "SELECT public_id, name, role_applied, stage, rating, source, applied_date, interview_scheduled
         FROM candidates
         ORDER BY applied_date DESC, public_id ASC"
    );

    return array_map(static function (array $row): array {
        return [
            'id' => $row['public_id'],
            'name' => $row['name'],
            'roleApplied' => $row['role_applied'],
            'stage' => $row['stage'],
            'rating' => (float) $row['rating'],
            'source' => $row['source'],
            'appliedDate' => $row['applied_date'],
            'interviewScheduled' => $row['interview_scheduled'],
        ];
    }, $stmt->fetchAll());
}

function fetch_leave_rows(PDO $pdo, ?int $employeeId = null): array
{
    $sql = "SELECT
            lr.public_id,
            e.public_id AS employee_public_id,
            e.name AS employee_name,
            lr.type,
            lr.start_date,
            lr.end_date,
            lr.status,
            lr.reason
        FROM leave_requests lr
        INNER JOIN employees e ON e.id = lr.employee_id";

    $params = [];
    if ($employeeId !== null) {
        $sql .= ' WHERE lr.employee_id = :employee_id';
        $params['employee_id'] = $employeeId;
    }

    $sql .= ' ORDER BY lr.start_date DESC, lr.public_id ASC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    return array_map(static function (array $row): array {
        return [
            'id' => $row['public_id'],
            'employeeId' => $row['employee_public_id'],
            'employeeName' => $row['employee_name'],
            'type' => $row['type'],
            'startDate' => $row['start_date'],
            'endDate' => $row['end_date'],
            'status' => $row['status'],
            'reason' => $row['reason'],
        ];
    }, $stmt->fetchAll());
}

function fetch_attendance_rows(PDO $pdo, ?int $employeeId = null): array
{
    $sql = "SELECT
            al.public_id,
            e.name AS employee_name,
            al.work_date,
            al.check_in,
            al.check_out,
            al.status,
            al.shift
        FROM attendance_logs al
        INNER JOIN employees e ON e.id = al.employee_id";

    $params = [];
    if ($employeeId !== null) {
        $sql .= ' WHERE al.employee_id = :employee_id';
        $params['employee_id'] = $employeeId;
    }

    $sql .= ' ORDER BY al.work_date DESC, al.public_id ASC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    return array_map(static function (array $row): array {
        return [
            'id' => $row['public_id'],
            'employeeName' => $row['employee_name'],
            'date' => $row['work_date'],
            'checkIn' => time_label($row['check_in']),
            'checkOut' => time_label($row['check_out']),
            'status' => $row['status'],
            'shift' => $row['shift'],
        ];
    }, $stmt->fetchAll());
}

function fetch_document_rows(PDO $pdo, bool $employeeVisibleOnly): array
{
    $sql = "SELECT id, name, document_type, file_size, uploaded_by, uploaded_date, category
        FROM documents";

    if ($employeeVisibleOnly) {
        $sql .= " WHERE category IN ('company', 'compliance') OR document_type = 'Benefits'";
    }

    $sql .= ' ORDER BY uploaded_date DESC, id ASC';

    $stmt = $pdo->query($sql);

    return array_map(static function (array $row): array {
        return [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'type' => $row['document_type'],
            'size' => $row['file_size'],
            'uploadedBy' => $row['uploaded_by'],
            'date' => $row['uploaded_date'],
            'category' => $row['category'],
        ];
    }, $stmt->fetchAll());
}

function fetch_pay_period_rows(PDO $pdo, bool $includePayPeriods): array
{
    if (!$includePayPeriods) {
        return [];
    }

    $stmt = $pdo->query(
        "SELECT period_label, total_payout, employee_count, status
         FROM pay_periods
         ORDER BY id ASC"
    );

    return array_map(static function (array $row): array {
        return [
            'period' => $row['period_label'],
            'totalPayout' => (float) $row['total_payout'],
            'employees' => (int) $row['employee_count'],
            'employeeCount' => (int) $row['employee_count'],
            'status' => $row['status'],
        ];
    }, $stmt->fetchAll());
}

function current_employee_id(PDO $pdo, array $user): ?int
{
    $stmt = $pdo->prepare(
        'SELECT id
         FROM employees
         WHERE user_id = :user_id OR name = :name
         ORDER BY CASE WHEN user_id = :user_id THEN 0 ELSE 1 END
         LIMIT 1'
    );
    $stmt->execute([
        'user_id' => (int) $user['id'],
        'name' => $user['name'],
    ]);

    $employee = $stmt->fetch();
    return $employee ? (int) $employee['id'] : null;
}

try {
    $isEmployee = $user['role'] === 'employee';
    $employeeId = $isEmployee ? current_employee_id($pdo, $user) : null;
    $canReadWorkforceData = in_array($user['role'], ['admin', 'exec'], true);

    json_response([
        'employees' => fetch_employee_rows($pdo, $employeeId),
        'candidates' => fetch_candidate_rows($pdo, $canReadWorkforceData),
        'leaveRequests' => fetch_leave_rows($pdo, $employeeId),
        'attendanceLogs' => fetch_attendance_rows($pdo, $employeeId),
        'documents' => fetch_document_rows($pdo, $isEmployee),
        'payPeriods' => fetch_pay_period_rows($pdo, $canReadWorkforceData),
    ]);
} catch (PDOException) {
    json_response(['message' => 'HR data tables are not ready. Import backend/database/schema.sql and try again.'], 500);
}
