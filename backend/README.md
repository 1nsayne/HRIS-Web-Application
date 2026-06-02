# PeopleOS PHP Auth Backend

This backend is designed for Laragon with MySQL/MariaDB.

## Setup

1. Start Laragon, then start Apache/Nginx and MySQL.
2. Open Laragon Terminal from this project folder.
3. Import the database:

```powershell
mysql -u root < backend/database/schema.sql
```

4. Optional: copy `backend/.env.example` to `backend/.env` if your database settings are different.
5. Start the PHP API server:

```powershell
php -S 127.0.0.1:8000 -t backend
```

6. Start the React app:

```powershell
npm run dev
```

The Vite app proxies `/api/*` requests to `http://127.0.0.1:8000`.

## Demo Accounts

All demo accounts use this password:

```text
peopleos
```

- `jane.doe@peopleos.com` - HR Admin
- `sarah.jenkins@peopleos.com` - Employee
- `alex.rivera@peopleos.com` - Executive
