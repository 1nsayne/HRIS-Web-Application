<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/hr-helpers.php';

$user = require_user();
$pdo = db();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $employeeId = $user['role'] === 'employee' ? hr_current_employee_id($pdo, $user) : null;
        json_response(['employees' => hr_fetch_employee_rows($pdo, $employeeId)]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['message' => 'Method not allowed.'], 405);
    }

    if ($user['role'] !== 'admin') {
        json_response(['message' => 'Forbidden.'], 403);
    }

    $input = json_input();
    $name = trim((string) ($input['name'] ?? ''));
    $role = trim((string) ($input['role'] ?? ''));
    $department = trim((string) ($input['department'] ?? 'Product'));
    $email = strtolower(trim((string) ($input['email'] ?? '')));

    if ($name === '' || $role === '') {
        json_response(['message' => 'Employee name and role are required.'], 422);
    }

    $publicId = hr_next_public_id($pdo, 'employees', 'EMP', 3);
    if ($email === '') {
        $email = strtolower(str_replace(' ', '.', $name)) . '+' . strtolower($publicId) . '@company.com';
    }

    $departmentId = hr_department_id($pdo, $department);
    $stmt = $pdo->prepare(
        'INSERT INTO employees (
            public_id, user_id, department_id, name, role_title, status, email, phone, location,
            date_joined, salary, monthly_deductions, monthly_benefits,
            vacation_balance, sick_balance, personal_balance, performance_rating,
            recruitment_source, avatar_url
         )
         VALUES (
            :public_id, NULL, :department_id, :name, :role_title, :status, :email, :phone, :location,
            :date_joined, :salary, :monthly_deductions, :monthly_benefits,
            :vacation_balance, :sick_balance, :personal_balance, :performance_rating,
            :recruitment_source, :avatar_url
         )'
    );
    $stmt->execute([
        'public_id' => $publicId,
        'department_id' => $departmentId,
        'name' => $name,
        'role_title' => $role,
        'status' => $input['status'] ?? 'Active',
        'email' => $email,
        'phone' => $input['phone'] ?? '',
        'location' => $input['location'] ?? '',
        'date_joined' => $input['dateJoined'] ?? date('Y-m-d'),
        'salary' => (float) ($input['salary'] ?? 0),
        'monthly_deductions' => (float) ($input['deductions'] ?? 0),
        'monthly_benefits' => (float) ($input['benefits'] ?? 0),
        'vacation_balance' => (int) ($input['leaveBalances']['vacation'] ?? 15),
        'sick_balance' => (int) ($input['leaveBalances']['sick'] ?? 10),
        'personal_balance' => (int) ($input['leaveBalances']['personal'] ?? 5),
        'performance_rating' => (float) ($input['performanceRating'] ?? 0),
        'recruitment_source' => $input['recruitmentSource'] ?? '',
        'avatar_url' => $input['avatar'] ?? '',
    ]);

    $employee = hr_fetch_employee_row($pdo, (int) $pdo->lastInsertId());
    json_response(['employee' => $employee], 201);
} catch (PDOException) {
    json_response(['message' => 'Unable to load or save employees. Check duplicate email values and make sure backend/database/schema.sql is imported.'], 500);
}
