<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OutletController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;
use Illuminate\Routing\Middleware\ThrottleRequests;

// ─── Endpoint Publik ──────────────────────────────────────────────────────────
Route::get('/catalog', [CatalogController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/outlets', [OutletController::class, 'index']);

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{code}', [OrderController::class, 'show']);

// ─── Autentikasi JWT ──────────────────────────────────────────────────────────
Route::middleware([ThrottleRequests::class . ':10,1'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

use App\Http\Controllers\Api\AddonController;

// ─── Endpoint Terproteksi (JWT) ───────────────────────────────────────────────
Route::middleware(['auth:api', ThrottleRequests::class . ':10,1'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    Route::get('/admin/orders', [OrderController::class, 'index']);
    Route::get('/admin/orders/{code}', [OrderController::class, 'adminShow']);
    Route::patch('/admin/orders/{code}/status', [OrderController::class, 'updateStatus']);
    Route::put('/admin/services', [ServiceController::class, 'sync']);
    Route::put('/admin/addons', [AddonController::class, 'sync']);
    Route::get('/admin/reports', [ReportController::class, 'index']);
});
