# HRIS Backend Context And Database Plan

Use this file first when continuing backend work. It exists to reduce token usage by pointing Codex to only the files needed for the database/API implementation and by documenting the data contract the frontend currently expects.

## Minimal File Set To Read

Read these first:

- `backend/api/bootstrap.php` - shared PHP helpers, sessions, JSON responses, PDO connection.
- `backend/database/schema.sql` - current database schema and demo auth users.
- `backend/README.md` - local setup and demo login accounts.
- `src/app/data/initialData.ts` - current frontend dummy data that must move into MySQL.
- `src/app/App.tsx` - current frontend state shape and callback flow.

Read these only when wiring a specific API response:

- `src/app/views/EmployeeDirectory.tsx` - employee list columns and filters.
- `src/app/views/Dashboard.tsx` - dashboard metrics from employees, leave, attendance, candidates.
- `src/app/views/Attendance.tsx` - attendance log fields.
- `src/app/views/LeaveManagement.tsx` - leave request fields and status updates.
- `src/app/views/Payroll.tsx` - salary, deduction, benefit, pay-period data.
- `src/app/views/Recruitment.tsx` - candidate pipeline fields and stage updates.
- `src/app/views/Performance.tsx` - performance rating fields.
- `src/app/views/Documents.tsx` - document library fields.

Avoid reading the large `src/app/components/ui/*` folder for backend work unless there is a specific UI bug.

## Current Auth State

The backend currently supports only authentication:

- `POST /api/login.php`
- `POST /api/logout.php`
- `GET /api/me.php`

`users` table already exists and contains these demo accounts. Password for all is `peopleos`.

- `jane.doe@peopleos.com` - `admin`, HR Manager
- `sarah.jenkins@peopleos.com` - `employee`, Product Designer
- `alex.rivera@peopleos.com` - `exec`, Chief Operating Officer

Keep these accounts stable because the README and manual test flow rely on them.

## Frontend Data Contract

The React app currently keeps HR data in memory from `src/app/data/initialData.ts`. Backend work should replace those arrays with API responses that preserve the same field names first. After the UI works, fields can be normalized in a later refactor.

### Employee Object

Used by Employee Directory, Dashboard, Payroll, Performance, Leave, Settings, and employee profile.

Required fields:

- `id` - string public employee id, example `EMP-001`.
- `name`
- `role` - role title shown as "Role Title".
- `department`
- `status` - currently `Active` or `On Leave`.
- `email`
- `phone`
- `location`
- `dateJoined`
- `salary` - annual salary number.
- `deductions` - monthly deductions number.
- `benefits` - monthly benefits number.
- `leaveBalances.vacation`
- `leaveBalances.sick`
- `leaveBalances.personal`
- `performanceRating`
- `recruitmentSource`
- `avatar`

Employee Directory columns:

- Personnel Details: `name`, `id`, `avatar`
- Department: `department`
- Role Title: `role`
- Location: `location`
- Status: `status`
- Actions: frontend-only profile inspection

### Candidate Object

Required fields:

- `id` - public candidate id, example `CAN-001`.
- `name`
- `roleApplied`
- `stage` - `Applied`, `Screening`, `Technical Assessment`, `Interview`, `Offer Stage`.
- `rating`
- `source`
- `appliedDate`
- `interviewScheduled` - date string or null.

### Leave Request Object

Required fields:

- `id` - public leave id, example `LRQ-101`.
- `employeeId`
- `employeeName`
- `type` - `Vacation`, `Sick Leave`, `Personal Day`, `Maternity/Paternity`.
- `startDate`
- `endDate`
- `status` - `Pending`, `Approved`, `Rejected`.
- `reason`

### Attendance Log Object

Required fields:

- `id` - public attendance id, example `ATT-001`.
- `employeeName`
- `date`
- `checkIn`
- `checkOut`
- `status` - `On Time`, `Late`, `Excused`, `Absent`, `Scheduled`.
- `shift`

### Document Object

Required fields:

- `id`
- `name`
- `type`
- `size`
- `uploadedBy`
- `date`
- `category` - `company`, `hr`, `compliance`, `template`.

## Proposed Database Schema

Add these tables to `backend/database/schema.sql`. Keep `users` as-is and relate employees to users with `user_id` when possible.

```sql
CREATE TABLE IF NOT EXISTS departments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  manager_name VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(20) NOT NULL UNIQUE,
  user_id INT UNSIGNED NULL,
  department_id INT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  role_title VARCHAR(120) NOT NULL,
  status ENUM('Active', 'On Leave', 'Inactive') NOT NULL DEFAULT 'Active',
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(40) NULL,
  location VARCHAR(120) NULL,
  date_joined DATE NOT NULL,
  salary DECIMAL(12,2) NOT NULL DEFAULT 0,
  monthly_deductions DECIMAL(12,2) NOT NULL DEFAULT 0,
  monthly_benefits DECIMAL(12,2) NOT NULL DEFAULT 0,
  vacation_balance INT NOT NULL DEFAULT 0,
  sick_balance INT NOT NULL DEFAULT 0,
  personal_balance INT NOT NULL DEFAULT 0,
  performance_rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  recruitment_source VARCHAR(120) NULL,
  avatar_url TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_employees_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS candidates (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  role_applied VARCHAR(120) NOT NULL,
  stage ENUM('Applied', 'Screening', 'Technical Assessment', 'Interview', 'Offer Stage') NOT NULL DEFAULT 'Applied',
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  source VARCHAR(120) NOT NULL,
  applied_date DATE NOT NULL,
  interview_scheduled DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(20) NOT NULL UNIQUE,
  employee_id INT UNSIGNED NOT NULL,
  type ENUM('Vacation', 'Sick Leave', 'Personal Day', 'Maternity/Paternity') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  reason TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(20) NOT NULL UNIQUE,
  employee_id INT UNSIGNED NOT NULL,
  work_date DATE NOT NULL,
  check_in TIME NULL,
  check_out TIME NULL,
  status ENUM('On Time', 'Late', 'Excused', 'Absent', 'Scheduled') NOT NULL,
  shift VARCHAR(80) NOT NULL DEFAULT 'Day Shift',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(190) NOT NULL,
  document_type VARCHAR(80) NOT NULL,
  file_size VARCHAR(40) NOT NULL,
  uploaded_by VARCHAR(120) NOT NULL,
  uploaded_date DATE NOT NULL,
  category ENUM('company', 'hr', 'compliance', 'template') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pay_periods (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  period_label VARCHAR(80) NOT NULL UNIQUE,
  total_payout DECIMAL(12,2) NOT NULL DEFAULT 0,
  employee_count INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('processing', 'completed') NOT NULL DEFAULT 'processing',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Seed Dummy Data

Use this seed data so the dashboard can render immediately after importing the schema.

```sql
INSERT INTO departments (name, manager_name)
VALUES
  ('Engineering', 'Sarah Jenkins'),
  ('Product', 'Marcus Chen'),
  ('Design', 'David Kojo'),
  ('People Operations', 'Elena Rostova')
ON DUPLICATE KEY UPDATE manager_name = VALUES(manager_name);

INSERT INTO employees (
  public_id, user_id, department_id, name, role_title, status, email, phone, location,
  date_joined, salary, monthly_deductions, monthly_benefits,
  vacation_balance, sick_balance, personal_balance, performance_rating,
  recruitment_source, avatar_url
)
VALUES
  (
    'EMP-001',
    (SELECT id FROM users WHERE email = 'sarah.jenkins@peopleos.com'),
    (SELECT id FROM departments WHERE name = 'Engineering'),
    'Sarah Jenkins', 'Principal Software Engineer', 'Active', 'sarah.j@company.com',
    '+1 (555) 019-2834', 'San Francisco, CA', '2021-03-15',
    145000, 4200, 1200, 18, 10, 4, 4.8, 'Direct Referral',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  ),
  (
    'EMP-002', NULL, (SELECT id FROM departments WHERE name = 'Product'),
    'Marcus Chen', 'Product Manager', 'Active', 'marcus.c@company.com',
    '+1 (555) 014-9876', 'Austin, TX', '2022-06-01',
    120000, 3100, 1100, 14, 8, 5, 4.5, 'LinkedIn',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  ),
  (
    'EMP-003', NULL, (SELECT id FROM departments WHERE name = 'People Operations'),
    'Elena Rostova', 'HR Manager', 'Active', 'elena.r@company.com',
    '+1 (555) 017-3456', 'Remote, US', '2020-11-10',
    95000, 2500, 950, 22, 12, 6, 4.9, 'Indeed',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80'
  ),
  (
    'EMP-004', NULL, (SELECT id FROM departments WHERE name = 'Design'),
    'David Kojo', 'UI/UX Designer', 'Active', 'david.k@company.com',
    '+1 (555) 012-4567', 'New York, NY', '2023-01-15',
    110000, 2900, 1050, 12, 7, 3, 4.2, 'Dribbble',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  ),
  (
    'EMP-005', NULL, (SELECT id FROM departments WHERE name = 'Engineering'),
    'Alisha Patel', 'Senior QA Analyst', 'On Leave', 'alisha.p@company.com',
    '+1 (555) 015-7890', 'San Francisco, CA', '2022-09-15',
    105000, 2800, 1000, 5, 4, 2, 4.6, 'Glassdoor',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  )
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  role_title = VALUES(role_title),
  department_id = VALUES(department_id),
  status = VALUES(status),
  phone = VALUES(phone),
  location = VALUES(location),
  salary = VALUES(salary),
  monthly_deductions = VALUES(monthly_deductions),
  monthly_benefits = VALUES(monthly_benefits),
  vacation_balance = VALUES(vacation_balance),
  sick_balance = VALUES(sick_balance),
  personal_balance = VALUES(personal_balance),
  performance_rating = VALUES(performance_rating),
  recruitment_source = VALUES(recruitment_source),
  avatar_url = VALUES(avatar_url);

INSERT INTO candidates (public_id, name, role_applied, stage, rating, source, applied_date, interview_scheduled)
VALUES
  ('CAN-001', 'Sophia Martinez', 'Frontend Developer', 'Screening', 4.5, 'LinkedIn', '2026-05-28', '2026-06-04'),
  ('CAN-002', 'Liam O''Connor', 'Fullstack Engineer', 'Interview', 4.8, 'Direct Referral', '2026-05-24', '2026-06-02'),
  ('CAN-003', 'Emma Watson', 'Product Designer', 'Technical Assessment', 4.2, 'Dribbble', '2026-05-20', NULL),
  ('CAN-004', 'Zahir Abbas', 'Engineering Manager', 'Offer Stage', 4.9, 'Recruiter Direct', '2026-05-10', '2026-06-05'),
  ('CAN-005', 'Chloe Dubois', 'HR Generalist', 'Applied', 3.9, 'Indeed', '2026-05-31', NULL)
ON DUPLICATE KEY UPDATE
  stage = VALUES(stage),
  rating = VALUES(rating),
  interview_scheduled = VALUES(interview_scheduled);

INSERT INTO leave_requests (public_id, employee_id, type, start_date, end_date, status, reason)
VALUES
  ('LRQ-101', (SELECT id FROM employees WHERE public_id = 'EMP-001'), 'Vacation', '2026-07-10', '2026-07-17', 'Pending', 'Annual family summer trip'),
  ('LRQ-102', (SELECT id FROM employees WHERE public_id = 'EMP-002'), 'Sick Leave', '2026-06-05', '2026-06-06', 'Approved', 'Dental surgery recovery'),
  ('LRQ-103', (SELECT id FROM employees WHERE public_id = 'EMP-005'), 'Maternity/Paternity', '2026-05-15', '2026-08-15', 'Approved', 'Maternity leave'),
  ('LRQ-104', (SELECT id FROM employees WHERE public_id = 'EMP-004'), 'Personal Day', '2026-06-15', '2026-06-16', 'Pending', 'Moving to new apartment')
ON DUPLICATE KEY UPDATE
  status = VALUES(status),
  reason = VALUES(reason);

INSERT INTO attendance_logs (public_id, employee_id, work_date, check_in, check_out, status, shift)
VALUES
  ('ATT-001', (SELECT id FROM employees WHERE public_id = 'EMP-001'), '2026-06-02', '08:55:00', '17:30:00', 'On Time', 'Day Shift'),
  ('ATT-002', (SELECT id FROM employees WHERE public_id = 'EMP-002'), '2026-06-02', '09:15:00', '18:00:00', 'Late', 'Day Shift'),
  ('ATT-003', (SELECT id FROM employees WHERE public_id = 'EMP-003'), '2026-06-02', '08:45:00', '17:00:00', 'On Time', 'Day Shift'),
  ('ATT-004', (SELECT id FROM employees WHERE public_id = 'EMP-004'), '2026-06-02', '09:02:00', '17:45:00', 'On Time', 'Day Shift'),
  ('ATT-005', (SELECT id FROM employees WHERE public_id = 'EMP-005'), '2026-06-02', NULL, NULL, 'Excused', 'Day Shift')
ON DUPLICATE KEY UPDATE
  check_in = VALUES(check_in),
  check_out = VALUES(check_out),
  status = VALUES(status);

INSERT INTO documents (name, document_type, file_size, uploaded_by, uploaded_date, category)
VALUES
  ('Employee Handbook 2026', 'Policy', '2.4 MB', 'Jane Doe', '2026-01-15', 'company'),
  ('Code of Conduct', 'Policy', '856 KB', 'Jane Doe', '2026-01-15', 'company'),
  ('Benefits Guide', 'Benefits', '1.8 MB', 'Maria Garcia', '2026-02-01', 'hr'),
  ('Remote Work Policy', 'Policy', '645 KB', 'Jane Doe', '2026-03-10', 'company'),
  ('Performance Review Template', 'Template', '324 KB', 'Maria Garcia', '2026-04-05', 'template'),
  ('Safety Guidelines', 'Compliance', '1.2 MB', 'Jane Doe', '2026-01-20', 'compliance'),
  ('Data Privacy Policy', 'Compliance', '987 KB', 'Jane Doe', '2026-01-25', 'compliance'),
  ('Onboarding Checklist', 'Template', '456 KB', 'Maria Garcia', '2026-02-15', 'template');

INSERT INTO pay_periods (period_label, total_payout, employee_count, status)
VALUES
  ('June 2026', 720450, 153, 'processing'),
  ('May 2026', 715300, 150, 'completed'),
  ('April 2026', 708900, 148, 'completed'),
  ('March 2026', 695200, 145, 'completed')
ON DUPLICATE KEY UPDATE
  total_payout = VALUES(total_payout),
  employee_count = VALUES(employee_count),
  status = VALUES(status);
```

## API Endpoint Plan

Implement endpoints under `backend/api/`. Start read-only, then add mutations.

Read endpoints:

- `GET /api/hr-data.php`
  - Return all app bootstrap data in one request: employees, candidates, leaveRequests, attendanceLogs, documents, payPeriods.
  - This is the fastest migration path because `App.tsx` can replace `INITIAL_*` arrays with one fetch.
- `GET /api/employees.php`
- `GET /api/candidates.php`
- `GET /api/leave-requests.php`
- `GET /api/attendance-logs.php`
- `GET /api/documents.php`
- `GET /api/pay-periods.php`

Mutation endpoints:

- `POST /api/employees.php` - create employee.
- `POST /api/candidates.php` - create candidate.
- `POST /api/candidate-stage.php` - update candidate stage.
- `POST /api/leave-requests.php` - create leave request.
- `POST /api/leave-status.php` - approve/reject leave.
- `POST /api/punch.php` - employee punch in/out.

## Response Mapping Rules

Return frontend-friendly camelCase keys to minimize React edits.

Employee SQL to JSON:

- `public_id` -> `id`
- `role_title` -> `role`
- `departments.name` -> `department`
- `date_joined` -> `dateJoined`
- `monthly_deductions` -> `deductions`
- `monthly_benefits` -> `benefits`
- balances -> `leaveBalances: { vacation, sick, personal }`
- `performance_rating` -> `performanceRating`
- `recruitment_source` -> `recruitmentSource`
- `avatar_url` -> `avatar`

Attendance SQL to JSON:

- `public_id` -> `id`
- `employees.name` -> `employeeName`
- `work_date` -> `date`
- `check_in` -> formatted `08:55 AM` or `--`
- `check_out` -> formatted `05:30 PM` or `--`

Leave SQL to JSON:

- `public_id` -> `id`
- `employees.public_id` -> `employeeId`
- `employees.name` -> `employeeName`
- `start_date` -> `startDate`
- `end_date` -> `endDate`

Candidate SQL to JSON:

- `public_id` -> `id`
- `role_applied` -> `roleApplied`
- `applied_date` -> `appliedDate`
- `interview_scheduled` -> `interviewScheduled`

Document SQL to JSON:

- `document_type` -> `type`
- `file_size` -> `size`
- `uploaded_by` -> `uploadedBy`
- `uploaded_date` -> `date`

## Implementation Order

(/) 1. Extend `backend/database/schema.sql` with the proposed tables and seed data.
(/) 2. Add a shared auth guard helper in `bootstrap.php`, for example `require_user()`.
(/) 3. Create `backend/api/hr-data.php` with read-only data for all roles.
4. Update `src/app/App.tsx` to fetch `/api/hr-data.php` after session restore.
5. Keep frontend fallback to `INITIAL_*` arrays if API fails during development.
6. Add mutation endpoints one at a time and replace the in-memory handlers:
   - leave create/status
   - candidate create/stage
   - employee create
   - punch in/out
7. After data is API-backed, remove or demote `src/app/data/initialData.ts` to frontend fallback only.

## Role Access Rules

- `admin`: can read all data and mutate employees, payroll actions, leave status, candidate stages, documents.
- `employee`: can read own employee record, own leave, own attendance, company documents, own settings.
- `exec`: can read aggregate or read-only workforce data, employee list, payroll summary, recruitment pipeline, performance, and documents. No mutation controls.

Start simple in PHP:

- Check `$_SESSION['user_id']`.
- Fetch current user from `users`.
- Reject unauthenticated requests with 401.
- Reject insufficient roles with 403.

## Dashboard Must Work With Dummy Data

The first backend milestone is successful when:

- Admin login shows employees from MySQL in Employee Directory.
- Executive dashboard metrics are computed from MySQL employees/candidates.
- HR admin dashboard attendance, leave queue, pipeline, and payroll cards render from MySQL.
- Employee login can still see personal dashboard data for Sarah Jenkins.
- If MySQL/API fails, the frontend can still fall back to existing `INITIAL_*` arrays temporarily.
