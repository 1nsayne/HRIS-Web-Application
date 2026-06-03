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
$stage = trim((string) ($input['stage'] ?? ''));
$validStages = ['Applied', 'Screening', 'Technical Assessment', 'Interview', 'Offer Stage'];

if ($id === '' || !in_array($stage, $validStages, true)) {
    json_response(['message' => 'Candidate id and valid stage are required.'], 422);
}

try {
    $stmt = db()->prepare('UPDATE candidates SET stage = :stage WHERE public_id = :id');
    $stmt->execute([
        'stage' => $stage,
        'id' => $id,
    ]);

    $candidate = hr_fetch_candidate_row(db(), $id);
    if (!$candidate) {
        json_response(['message' => 'Candidate was not found.'], 404);
    }

    json_response(['candidate' => $candidate]);
} catch (PDOException) {
    json_response(['message' => 'Unable to update candidate stage. Make sure backend/database/schema.sql is imported.'], 500);
}
