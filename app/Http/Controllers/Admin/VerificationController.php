<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\WhistleblowerReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerificationController extends Controller
{
    /**
     * Verification Center - tabel semua pengajuan dengan smart highlighting.
     */
    public function index(Request $request)
    {
        $query = Application::with('user')
            ->orderByRaw("
                CASE
                    WHEN status = 'pending' THEN 1
                    WHEN status = 'under_review' THEN 2
                    ELSE 3
                END
            ")
            ->orderByDesc('score'); // Skor tertinggi di atas

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or NIK
        if ($request->filled('search')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('nik', 'like', "%{$request->search}%");
            });
        }

        $applications = $query->paginate(15)->withQueryString();

        // Summary stats for admin header
        $summary = [
            'pending'      => Application::where('status', Application::STATUS_PENDING)->count(),
            'under_review' => Application::where('status', Application::STATUS_UNDER_REVIEW)->count(),
            'approved'     => Application::where('status', Application::STATUS_APPROVED)->count(),
            'rejected'     => Application::where('status', Application::STATUS_REJECTED)->count(),
        ];

        return Inertia::render('Admin/VerificationCenter', [
            'applications' => $applications,
            'summary'      => $summary,
            'filters'      => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Detail pengajuan satu warga.
     */
    public function show(Application $application)
    {
        $application->load('user', 'reviewer');

        return Inertia::render('Admin/ApplicationDetail', [
            'application' => $application,
        ]);
    }

    /**
     * Admin approve pengajuan.
     */
    public function approve(Request $request, Application $application)
    {
        $application->update([
            'status'      => Application::STATUS_APPROVED,
            'notes'       => $request->notes,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', "Pengajuan {$application->user->name} telah disetujui.");
    }

    /**
     * Admin reject pengajuan.
     */
    public function reject(Request $request, Application $application)
    {
        $request->validate([
            'rejection_reason' => ['required', 'string', 'min:10'],
        ]);

        $application->update([
            'status'           => Application::STATUS_REJECTED,
            'rejection_reason' => $request->rejection_reason,
            'reviewed_by'      => auth()->id(),
            'reviewed_at'      => now(),
        ]);

        return back()->with('success', "Pengajuan {$application->user->name} telah ditolak.");
    }

    /**
     * Dashboard Auditor - Ticket Investigasi Laporan Whistleblower.
     */
    public function tickets(Request $request)
    {
        $tickets = WhistleblowerReport::with('investigator')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderByRaw("
                CASE
                    WHEN status = 'open' THEN 1
                    WHEN status = 'investigating' THEN 2
                    ELSE 3
                END
            ")
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $summary = [
            'open'         => WhistleblowerReport::where('status', WhistleblowerReport::STATUS_OPEN)->count(),
            'investigating'=> WhistleblowerReport::where('status', WhistleblowerReport::STATUS_INVESTIGATING)->count(),
            'resolved'     => WhistleblowerReport::where('status', WhistleblowerReport::STATUS_RESOLVED)->count(),
        ];

        return Inertia::render('Admin/TicketInspector', [
            'tickets' => $tickets,
            'summary' => $summary,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Update status investigasi tiket laporan.
     */
    public function updateTicket(Request $request, WhistleblowerReport $report)
    {
        $validated = $request->validate([
            'status'            => ['required', 'in:open,investigating,resolved,dismissed'],
            'investigator_note' => ['nullable', 'string'],
        ]);

        $report->update([
            'status'            => $validated['status'],
            'investigator_note' => $validated['investigator_note'],
            'assigned_to'       => auth()->id(),
        ]);

        return back()->with('success', 'Status laporan berhasil diperbarui.');
    }
}
