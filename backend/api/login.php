<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['message' => 'Method not allowed.'], 405);
}

$input = json_input();
$email = strtolower(trim((string) ($input['email'] ?? '')));
$password = (string) ($input['password'] ?? '');
$selectedRole = trim((string) ($input['role'] ?? ''));

if ($email === '' || $password === '') {
    json_response(['message' => 'Email and password are required.'], 422);
}

$stmt = db()->prepare(
    'SELECT id, name, email, password_hash, role, title, is_active
     FROM users
     WHERE email = :email
     LIMIT 1'
);
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['message' => 'Invalid email or password.'], 401);
}

if ((int) $user['is_active'] !== 1) {
    json_response(['message' => 'This account is inactive.'], 403);
}

if ($selectedRole !== '' && $selectedRole !== $user['role']) {
    json_response(['message' => 'This account is not assigned to the selected role.'], 403);
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['id'];

$update = db()->prepare('UPDATE users SET last_login_at = NOW() WHERE id = :id');
$update->execute(['id' => $user['id']]);

json_response([
    'message' => 'Signed in successfully.',
    'user' => public_user($user),
]);
