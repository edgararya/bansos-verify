<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminScheduleController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auditor\AuditTrailController;
use App\Http\Controllers\Auditor\LaporanEksekutifController;
use App\Http\Controllers\Auth\AuditorLoginController;
use Illuminate\Support\Facades\Route;

// ════════════════════════════════════════════════════
//  ADMIN DESA ROUTES
// ════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════
//  AUDITOR PUSAT ROUTES
// ════════════════════════════════════════════════════
Route::prefix('auditor')->name('auditor.')->group(function () {

    Route::middleware('guest:auditor')->group(function () {
        Route::get('login',  [AuditorLoginController::class, 'create'])->name('login');
        Route::post('login', [AuditorLoginController::class, 'store']);
    });

    Route::middleware('auth:auditor')->group(function () {
        Route::post('logout', [AuditorLoginController::class, 'destroy'])->name('logout');

        Route::get('dashboard',        [AuditTrailController::class, 'whistleblowing'])->name('dashboard');
        Route::get('audit',            [AuditTrailController::class, 'index'])->name('audit');
        Route::post('suspend/{id}',    [AuditTrailController::class, 'suspend'])->name('suspend');

        Route::get('report',           [LaporanEksekutifController::class, 'index'])->name('report');
        Route::get('export-csv',       [LaporanEksekutifController::class, 'exportCsv'])->name('export-csv');
    });
});


// ════════════════════════════════════════════════════
//  CONTROLLER STUBS
// ════════════════════════════════════════════════════

/*
|--------------------------------------------------------------------------
| app/Http/Controllers/Admin/AdminDashboardController.php
|--------------------------------------------------------------------------
*/
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $applicants = Applicant::orderByDesc('eligibility_score')
            ->get()
            ->map(fn($a) => [
                'id'          => $a->id,
                'nama'        => $a->full_name,
                'nik'         => $a->nik,
                'pekerjaan'   => $a->occupation,
                'penghasilan' => 'Rp ' . number_format($a->monthly_income, 0, ',', '.') . '/bln',
                'tanggungan'  => $a->dependents . ' orang',
                'skor'        => $a->eligibility_score,
                'status'      => $a->status,
                'statusColor' => match($a->status) {
                    'Terverifikasi' => '#3f51b5',
                    'Ditolak'       => '#d32f2f',
                    default         => '#00796b',
                },
                'catatan'    => $a->rejection_reason,
                'ktp_photo'  => $a->ktp_photo,
            ]);

        return Inertia::render('Admin/AdminDashboard', [
            'applicants' => $applicants,
        ]);
    }

    public function validate(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'action'  => ['required', 'in:setujui,tolak'],
            'catatan' => ['nullable', 'string', 'max:500'],
        ]);

        $applicant = Applicant::findOrFail($id);
        $applicant->status           = $request->action === 'setujui' ? 'Terverifikasi' : 'Ditolak';
        $applicant->rejection_reason = $request->action === 'tolak' ? $request->catatan : null;
        $applicant->validated_by     = Auth::guard('admin')->id();
        $applicant->validated_at     = now();
        $applicant->save();

        return back()->with('success', 'Keputusan validasi berhasil disimpan.');
    }
}


/*
|--------------------------------------------------------------------------
| app/Http/Controllers/Admin/AdminScheduleController.php
|--------------------------------------------------------------------------
*/
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Disbursement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminScheduleController extends Controller
{
    public function index(): Response
    {
        $checklist = Disbursement::where('schedule_date', today())
            ->with('user')
            ->get()
            ->map(fn($d) => [
                'id'     => $d->id,
                'nama'   => $d->user->name,
                'nik'    => $d->user->nik,
                'jenis'  => $d->program,
                'status' => $d->status,
            ]);

        return Inertia::render('Admin/AdminSchedule', [
            'checklist' => $checklist,
        ]);
    }

    public function broadcast(Request $request): RedirectResponse
    {
        $request->validate([
            'tanggal' => ['required', 'date'],
            'lokasi'  => ['required', 'string'],
            'pesan'   => ['nullable', 'string'],
        ]);

        Schedule::create([
            'date'     => $request->tanggal,
            'location' => $request->lokasi,
            'message'  => $request->pesan,
            'admin_id' => auth('admin')->id(),
        ]);

        return back()->with('success', 'Jadwal berhasil disiarkan ke warga.');
    }

    public function markDone(Request $request): \Illuminate\Http\JsonResponse
    {
        $disbursement = Disbursement::findOrFail($request->id);
        $disbursement->status = 'Telah Disalurkan';
        $disbursement->save();

        return response()->json(['ok' => true]);
    }
}


/*
|--------------------------------------------------------------------------
| app/Http/Controllers/Auditor/AuditTrailController.php
|--------------------------------------------------------------------------
*/
namespace App\Http\Controllers\Auditor;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\AnonymousReport;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AuditTrailController extends Controller
{
    public function whistleblowing(): Response
    {
        $reports = AnonymousReport::orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id'       => $r->id,
                'tanggal'  => $r->created_at->format('d M Y'),
                'risiko'   => $r->risk_level,
                'pelapor'  => $r->is_anonymous ? 'Anonim' : $r->reporter_name,
                'isAnonim' => $r->is_anonymous,
                'aduan'    => $r->description,
                'status'   => $r->status,
            ]);

        return Inertia::render('Auditor/AuditorDashboard', [
            'reports' => $reports,
        ]);
    }

    public function index(): Response
    {
        $logs = AuditLog::with(['admin', 'applicant'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($l) => [
                'id'        => $l->id,
                'timestamp' => $l->created_at->format('d M Y H:i'),
                'pelaku'    => $l->admin->name,
                'warga'     => $l->applicant->full_name,
                'skor'      => $l->applicant->eligibility_score,
                'aksi'      => $l->action === 'setujui' ? 'Disetujui' : 'Ditolak',
                'bypass'    => $l->is_suspicious,
                'suspended' => $l->is_suspended,
                'rowBg'     => $l->is_suspicious ? 'rgba(70,8,9,0.15)' : 'transparent',
            ]);

        return Inertia::render('Auditor/AuditTrailLogs', [
            'logs' => $logs,
        ]);
    }

    public function suspend(int $id): RedirectResponse
    {
        $log = AuditLog::findOrFail($id);
        $log->is_suspended = true;
        $log->suspended_by = auth('auditor')->id();
        $log->save();

        return back()->with('success', 'Admin telah disuspend.');
    }
}


/*
|--------------------------------------------------------------------------
| app/Http/Controllers/Auditor/LaporanEksekutifController.php
|--------------------------------------------------------------------------
*/
namespace App\Http\Controllers\Auditor;

use App\Http\Controllers\Controller;
use App\Models\Disbursement;
use App\Models\AnonymousReport;
use App\Models\Applicant;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LaporanEksekutifController extends Controller
{
    public function index(): Response
    {
        $stats = [
            [
                'label' => 'Total Dana Tersalurkan',
                'value' => 'Rp ' . number_format(Disbursement::whereMonth('disbursed_at', now()->month)->sum('amount') / 1e9, 1) . ' Miliar',
                'sub'   => 'Bulan Ini - Kabupaten XYZ',
                'color' => '#00d492',
            ],
            [
                'label' => 'Aduan Masyarakat',
                'value' => AnonymousReport::whereIn('status', ['Menunggu Investigasi', 'Sedang Diproses'])->count() . ' Tiket',
                'sub'   => 'Menunggu Resolusi & Investigasi',
                'color' => '#ff8904',
            ],
            [
                'label' => 'Akurasi Sasaran AI',
                'value' => number_format(Applicant::whereNotNull('eligibility_score')->avg('eligibility_score'), 1) . '%',
                'sub'   => 'Berdasarkan Audit Validasi Silang',
                'color' => '#51a2ff',
            ],
        ];

        return Inertia::render('Auditor/LaporanEksekutif', [
            'stats' => $stats,
        ]);
    }

    public function exportCsv(): StreamedResponse
    {
        $applicants = Applicant::all();

        return response()->streamDownload(function () use ($applicants) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Nama', 'NIK', 'Pekerjaan', 'Penghasilan', 'Skor', 'Status']);
            foreach ($applicants as $a) {
                fputcsv($out, [$a->full_name, $a->nik, $a->occupation, $a->monthly_income, $a->eligibility_score, $a->status]);
            }
            fclose($out);
        }, 'data-kelurahan-' . now()->format('Ymd') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
*/
