<?php

namespace App\Http\Controllers\Auditor;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\AnonymousReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $logs = AuditLog::with(['admin', 'applicant.user'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($l) => [
                'id'        => $l->id,
                'timestamp' => $l->created_at->format('d M Y H:i'),
                'pelaku'    => $l->admin->name,
                'warga'     => $l->applicant->user->name,
                'skor'      => $l->applicant->score,
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

    public function updateReportStatus(int $id, Request $request): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:Menunggu,Sedang Diproses,Selesai,Ditolak'],
        ]);

        $report = AnonymousReport::findOrFail($id);
        $report->status = $request->status;
        $report->save();

        return back()->with('success', 'Status laporan diperbarui.');
    }
}
