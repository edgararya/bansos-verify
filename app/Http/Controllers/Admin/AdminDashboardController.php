<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $applicants = Application::with('user')
            ->orderByDesc('score')
            ->get()
            ->map(fn($a) => [
                'id'          => $a->id,
                'nama'        => $a->user->name,
                'nik'         => $a->user->nik,
                'pekerjaan'   => $a->employment_status,
                'penghasilan' => 'Rp ' . number_format($a->monthly_income, 0, ',', '.') . '/bln',
                'tanggungan'  => $a->dependents . ' orang',
                'skor'        => $a->score,
                'status'      => $a->status === 'approved' ? 'Terverifikasi' : ($a->status === 'rejected' ? 'Ditolak' : 'Menunggu'),
                'statusColor' => match($a->status) {
                    'approved' => '#3f51b5',
                    'rejected' => '#d32f2f',
                    default    => '#00796b',
                },
                'catatan'    => $a->rejection_reason,
                'ktp_photo'  => $a->ktp_path,
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

        $application = Application::findOrFail($id);
        $application->status           = $request->action === 'setujui' ? 'approved' : 'rejected';
        $application->rejection_reason = $request->action === 'tolak' ? $request->catatan : null;
        $application->reviewed_by      = Auth::guard('admin')->id();
        $application->reviewed_at      = now();
        $application->save();

        // Create Audit Log
        AuditLog::create([
            'admin_id'       => Auth::guard('admin')->id(),
            'application_id' => $application->id,
            'action'         => $request->action,
            'is_suspicious'  => ($request->action === 'setujui' && $application->score < 70),
        ]);

        return back()->with('success', 'Keputusan validasi berhasil disimpan.');
    }
}
