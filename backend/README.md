# PeopleOS PHP Auth Backend

This backend is designed for Laragon with MySQL/MariaDB.

## Setup

1. Start Laragon, then start Apache/Nginx and MySQL.
2. Open Laragon Terminal from this project folder.
3. Create a database named `hris_db`, then import the database:

```powershell
mysql -u root < backend/database/schema.sql
```

4. Optional: copy `backend/.env.example` to `backend/.env` if your database settings are different.
5. Start the PHP API server:

```powershell
& "C:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.exe" -S 127.0.0.1:8000 -t backend
```

6. Start the React app:

```powershell
npm run dev
```

The Vite app proxies `/api/*` requests to `http://127.0.0.1:8000`.

Note: opening `http://127.0.0.1:8000/` directly will show "Not Found". That is normal because this server only exposes API files like `/api/login.php` and `/api/me.php`.

## Demo Accounts

All demo accounts use this password:

```text
peopleos
```

- `jane.doe@peopleos.com` - HR Admin
- `sarah.jenkins@peopleos.com` - Employee
- `alex.rivera@peopleos.com` - Executive
