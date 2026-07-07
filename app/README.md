# Helmet Washing Service App (React Frontend)

Frontend React untuk HelmetWash. Terhubung ke backend Laravel API.

## Struktur Proyek

```
cuci helm/
├── app/        ← Frontend React (folder ini)
└── backend/    ← API Laravel 12 + MySQL
```

## Menjalankan (Development)

**1. Backend (Laragon + MySQL)**

Buat database `helmet_wash` di phpMyAdmin, lalu:

```bash
cd ../backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

**2. Frontend**

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

Vite sudah mem-proxy `/api` ke backend Laravel.

## Login Admin

- Username: `admin`
- Password: `admin123`

## Teknologi

- React 18 + Vite
- React Router
- Tailwind CSS
- Laravel 12 API + MySQL (backend)
