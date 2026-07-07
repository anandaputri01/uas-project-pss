# HelmetWash Backend (Laravel 12)

API backend untuk aplikasi HelmetWash. Database MySQL via Laragon.

## Setup (Laragon)

1. Buat database MySQL di Laragon/phpMyAdmin:
   ```sql
   CREATE DATABASE helmet_wash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Salin `.env.example` ke `.env` (jika belum ada), lalu sesuaikan:
   ```env
   APP_URL=http://localhost:8000
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=helmet_wash
   DB_USERNAME=root
   DB_PASSWORD=
   FRONTEND_URL=http://localhost:5173
   ```

3. Install & setup:
   ```bash
   composer install
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```

API berjalan di `http://localhost:8000/api`

## Login Admin

- Username: `admin`
- Password: `admin123`

## Endpoint API

| Method | URL | Auth |
|--------|-----|------|
| GET | `/api/catalog` | - |
| GET | `/api/services` | - |
| GET | `/api/outlets` | - |
| POST | `/api/orders` | - |
| GET | `/api/orders/{code}` | - |
| POST | `/api/login` | - |
| GET | `/api/me` | Sanctum |
| POST | `/api/logout` | Sanctum |
| GET | `/api/admin/orders` | Sanctum |
| PATCH | `/api/admin/orders/{code}/status` | Sanctum |
| PUT | `/api/admin/services` | Sanctum |
| GET | `/api/admin/reports` | Sanctum |
