<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/hr-helpers.php';

$user = require_user();
$pdo = db();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        json_response(['candidates' => hr_fetch_candidate_rows($pdo, in_array($user['role'], ['admin', 'exec'], true))]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['message' => 'Method not allowed.'], 405);
    }

    if ($user['role'] !== 'admin') {
        json_response(['message' => 'Forbidden.'], 403);
    }

    $input = json_input();
    $name = trim((string) ($input['name'] ?? ''));
    $roleApplied = trim((string) ($input['roleApplied'] ?? $input['role'] ?? ''));
    $source = trim((string) ($input['source'] ?? 'LinkedIn'));

    if ($name === '' || $roleApplied === '') {
        json_response(['message' => 'Candidate name and role are required.'], 422);
    }

    $publicId = hr_next_public_id($pdo, 'candidates', 'CAN', 3);
    $stmt = $pdo->prepare(
        'INSERT INTO candidates (public_id, name, role_applied, stage, rating, source, applied_date, interview_scheduled)
         VALUES (:public_id, :name, :role_applied, "Applied", 0, :source, CURDATE(), NULL)'
    );
    $stmt->execute([
        'public_id' => $publicId,
        'name' => $name,
        'role_applied' => $roleApplied,
        'source' => $source,
    ]);

    json_response(['candidate' => hr_fetch_candidate_row($pdo, $publicId)], 201);
} catch (PDOException) {
    json_response(['message' => 'Unable to load or save candidates. Make sure backend/database/schema.sql is imported.'], 500);
}
