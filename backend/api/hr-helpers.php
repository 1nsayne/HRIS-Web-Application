<?php
declare(strict_types=1);

function hr_time_label(?string $time): string
{
    if ($time === null || $time === '') {
        return '--';
    }

    $timestamp = strtotime($time);
    return $timestamp === false ? '--' : date('h:i A', $timestamp);
}

function hr_current_employee_id(PDO $pdo, array $user): ?int
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

function hr_next_public_id(PDO $pdo, string $table, string $prefix, int $width = 3): string
{
    $stmt = $pdo->prepare("SELECT public_id FROM {$table} WHERE public_id LIKE :prefix ORDER BY id DESC LIMIT 1");
    $stmt->execute(['prefix' => $prefix . '-%']);
    $lastId = (string) ($stmt->fetchColumn() ?: '');
    $lastNumber = 0;

    if (preg_match('/^' . preg_quote($prefix, '/') . '-(\d+)$/', $lastId, $matches)) {
        $lastNumber = (int) $matches[1];
    }

    return $prefix . '-' . str_pad((string) ($lastNumber + 1), $width, '0', STR_PAD_LEFT);
}

function hr_employee_by_public_id(PDO $pdo, string $publicId): ?array
{
    $stmt = $pdo->prepare('SELECT id, public_id, name FROM employees WHERE public_id = :public_id LIMIT 1');
    $stmt->execute(['public_id' => $publicId]);
    $employee = $stmt->fetch();

    return $employee ?: null;
}

function hr_department_id(PDO $pdo, string $departmentName): int
{
    $departmentName = trim($departmentName);
    if ($departmentName === '') {
        $departmentName = 'People Operations';
    }

    $stmt = $pdo->prepare('SELECT id FROM departments WHERE name = :name LIMIT 1');
    $stmt->execute(['name' => $departmentName]);
    $id = $stmt->fetchColumn();

    if ($id !== false) {
        return (int) $id;
    }

    $insert = $pdo->prepare('INSERT INTO departments (name) VALUES (:name)');
    $insert->execute(['name' => $departmentName]);

    return (int) $pdo->lastInsertId();
}

function hr_employee_payload(array $row): array
{
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
}

function hr_candidate_payload(array $row): array
{
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
}

function hr_leave_payload(array $row): array
{
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
}

function hr_attendance_payload(array $row): array
{
    return [
        'id' => $row['public_id'],
        'employeeName' => $row['employee_name'],
        'date' => $row['work_date'],
        'checkIn' => hr_time_label($row['check_in']),
        'checkOut' => hr_time_label($row['check_out']),
        'status' => $row['status'],
        'shift' => $row['shift'],
    ];
}

function hr_document_payload(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'type' => $row['document_type'],
        'size' => $row['file_size'],
        'uploadedBy' => $row['uploaded_by'],
        'date' => $row['uploaded_date'],
        'category' => $row['category'],
    ];
}

function hr_pay_period_payload(array $row): array
{
    return [
        'period' => $row['period_label'],
        'totalPayout' => (float) $row['total_payout'],
        'employees' => (int) $row['employee_count'],
        'employeeCount' => (int) $row['employee_count'],
        'status' => $row['status'],
    ];
}

function hr_fetch_employee_rows(PDO $pdo, ?int $employeeId = null): array
{
    $sql = "SELECT
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

    return array_map('hr_employee_payload', $stmt->fetchAll());
}

function hr_fetch_employee_row(PDO $pdo, int $employeeId): ?array
{
    $rows = hr_fetch_employee_rows($pdo, $employeeId);
    return $rows[0] ?? null;
}

function hr_fetch_candidate_rows(PDO $pdo, bool $includeCandidates): array
{
    if (!$includeCandidates) {
        return [];
    }

    $stmt = $pdo->query(
        "SELECT public_id, name, role_applied, stage, rating, source, applied_date, interview_scheduled
         FROM candidates
         ORDER BY applied_date DESC, public_id ASC"
    );

    return array_map('hr_candidate_payload', $stmt->fetchAll());
}

function hr_fetch_candidate_row(PDO $pdo, string $publicId): ?array
{
    $stmt = $pdo->prepare(
        'SELECT public_id, name, role_applied, stage, rating, source, applied_date, interview_scheduled
         FROM candidates
         WHERE public_id = :public_id
         LIMIT 1'
    );
    $stmt->execute(['public_id' => $publicId]);
    $candidate = $stmt->fetch();

    return $candidate ? hr_candidate_payload($candidate) : null;
}

function hr_fetch_leave_rows(PDO $pdo, ?int $employeeId = null): array
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

    return array_map('hr_leave_payload', $stmt->fetchAll());
}

function hr_fetch_leave_row(PDO $pdo, string $publicId): ?array
{
    $stmt = $pdo->prepare(
        "SELECT
            lr.public_id,
            e.public_id AS employee_public_id,
            e.name AS employee_name,
            lr.type,
            lr.start_date,
            lr.end_date,
            lr.status,
            lr.reason
        FROM leave_requests lr
        INNER JOIN employees e ON e.id = lr.employee_id
        WHERE lr.public_id = :public_id
        LIMIT 1"
    );
    $stmt->execute(['public_id' => $publicId]);
    $leave = $stmt->fetch();

    return $leave ? hr_leave_payload($leave) : null;
}

function hr_fetch_attendance_rows(PDO $pdo, ?int $employeeId = null): array
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

    return array_map('hr_attendance_payload', $stmt->fetchAll());
}

function hr_fetch_attendance_row(PDO $pdo, string $publicId): ?array
{
    $stmt = $pdo->prepare(
        "SELECT
            al.public_id,
            e.name AS employee_name,
            al.work_date,
            al.check_in,
            al.check_out,
            al.status,
            al.shift
        FROM attendance_logs al
        INNER JOIN employees e ON e.id = al.employee_id
        WHERE al.public_id = :public_id
        LIMIT 1"
    );
    $stmt->execute(['public_id' => $publicId]);
    $attendance = $stmt->fetch();

    return $attendance ? hr_attendance_payload($attendance) : null;
}

function hr_fetch_document_rows(PDO $pdo, bool $employeeVisibleOnly): array
{
    $sql = "SELECT id, name, document_type, file_size, uploaded_by, uploaded_date, category
        FROM documents";

    if ($employeeVisibleOnly) {
        $sql .= " WHERE category IN ('company', 'compliance') OR document_type = 'Benefits'";
    }

    $sql .= ' ORDER BY uploaded_date DESC, id ASC';

    $stmt = $pdo->query($sql);

    return array_map('hr_document_payload', $stmt->fetchAll());
}

function hr_fetch_pay_period_rows(PDO $pdo, bool $includePayPeriods): array
{
    if (!$includePayPeriods) {
        return [];
    }

    $stmt = $pdo->query(
        "SELECT period_label, total_payout, employee_count, status
         FROM pay_periods
         ORDER BY id ASC"
    );

    return array_map('hr_pay_period_payload', $stmt->fetchAll());
}
