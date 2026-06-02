CREATE DATABASE IF NOT EXISTS hris_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hris_db;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee', 'exec') NOT NULL DEFAULT 'employee',
  title VARCHAR(120) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password_hash, role, title)
VALUES
  ('Jane Doe', 'jane.doe@peopleos.com', '$2y$10$jNgtFccFgfV3r4kTvqfA/OoIq.SHXFKOHbMpA7kya8GyHpsm.5EHi', 'admin', 'HR Manager'),
  ('Sarah Jenkins', 'sarah.jenkins@peopleos.com', '$2y$10$jNgtFccFgfV3r4kTvqfA/OoIq.SHXFKOHbMpA7kya8GyHpsm.5EHi', 'employee', 'Product Designer'),
  ('Alex Rivera', 'alex.rivera@peopleos.com', '$2y$10$jNgtFccFgfV3r4kTvqfA/OoIq.SHXFKOHbMpA7kya8GyHpsm.5EHi', 'exec', 'Chief Operating Officer')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  title = VALUES(title),
  is_active = 1;
