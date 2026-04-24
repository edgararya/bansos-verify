<?php

use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\Citizen\CitizenDashboardController;
use App\Http\Controllers\Citizen\PemutakhiranDataController;
use App\Http\Controllers\Citizen\PortalPengaduanController;
use App\Http\Controllers\Citizen\PengaturanController;
use App\Http\Controllers\Public\LaporanAnonimController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\WhistleblowerController;
use Illuminate\Support\Facades\Route;

// ============================================================
// PUBLIC ROUTES (Tanpa Autentikasi)
// ============================================================

Route::get('/', [PublicController::class, 'index'])->name('home');

// Laporan Anonim (tanpa login)
Route::post('laporan-anonim', [LaporanAnonimController::class, 'store'])
    ->name('public.laporan-anonim');

// Whistleblower Portal - Anonim, tidak perlu login
Route::get('/laporkan', [WhistleblowerController::class, 'create'])->name('whistleblower.create');
Route::post('/laporkan', [WhistleblowerController::class, 'store'])->name('whistleblower.store');

// ============================================================
// CITIZEN ROUTES (Login: role = citizen)
// ============================================================
Route::middleware(['auth', 'verified', 'role:citizen'])->prefix('citizen')->name('citizen.')->group(function () {
    Route::get('dashboard',         [CitizenDashboardController::class, 'index'])->name('dashboard');

    Route::get('pemutakhiran',      [PemutakhiranDataController::class, 'index'])->name('update');
    Route::post('pemutakhiran',     [PemutakhiranDataController::class, 'store'])->name('update.store');

    Route::get('pengaduan',         [PortalPengaduanController::class, 'index'])->name('complaint');
    Route::post('pengaduan',        [PortalPengaduanController::class, 'store'])->name('complaint.store');

    Route::get('pengaturan',        [PengaturanController::class, 'index'])->name('settings');
    Route::put('pengaturan/profil', [PengaturanController::class, 'updateProfile'])->name('settings.update-profile');
    Route::put('pengaturan/password', [PengaturanController::class, 'updatePassword'])->name('settings.update-password');
});

// ============================================================
//  ADMIN DESA ROUTES
// ============================================================
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminScheduleController;
use App\Http\Controllers\Auth\AdminLoginController;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login',  [AdminLoginController::class, 'create'])->name('login');
        Route::post('login', [AdminLoginController::class, 'store']);
    });

    Route::middleware('auth:admin')->group(function () {
        Route::post('logout', [AdminLoginController::class, 'destroy'])->name('logout');
        Route::get('dashboard',          [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('validate/{id}',     [AdminDashboardController::class, 'validate'])->name('validate');
        Route::get('schedule',           [AdminScheduleController::class, 'index'])->name('schedule');
        Route::post('schedule/broadcast',[AdminScheduleController::class, 'broadcast'])->name('schedule.broadcast');
        Route::post('schedule/mark-done',[AdminScheduleController::class, 'markDone'])->name('schedule.mark-done');
    });
});

// ============================================================
//  AUDITOR PUSAT ROUTES
// ============================================================
use App\Http\Controllers\Auditor\AuditTrailController;
use App\Http\Controllers\Auditor\LaporanEksekutifController;
use App\Http\Controllers\Auth\AuditorLoginController;

Route::prefix('auditor')->name('auditor.')->group(function () {
    Route::middleware('guest:auditor')->group(function () {
        Route::get('login',  [AuditorLoginController::class, 'create'])->name('login');
        Route::post('login', [AuditorLoginController::class, 'store']);
    });

    Route::middleware('auth:auditor')->group(function () {
        Route::post('logout', [AuditorLoginController::class, 'destroy'])->name('logout');
        Route::get('dashboard',        [AuditTrailController::class, 'whistleblowing'])->name('dashboard');
        Route::patch('report/{id}/status', [AuditTrailController::class, 'updateReportStatus'])->name('report.update-status');
        Route::get('audit',            [AuditTrailController::class, 'index'])->name('audit');
        Route::post('suspend/{id}',    [AuditTrailController::class, 'suspend'])->name('suspend');
        Route::get('report',           [LaporanEksekutifController::class, 'index'])->name('report');
        Route::get('export-csv',       [LaporanEksekutifController::class, 'exportCsv'])->name('export-csv');
    });
});

// ============================================================
// SHARED AUTH ROUTES (Profile - Semua yang login)
// ============================================================
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
