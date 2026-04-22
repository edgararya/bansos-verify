<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\WhistleblowerReport;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Landing page dengan statistik agregat (tanpa login).
     */
    public function index()
    {
        // Statistik publik untuk dashboard transparansi
        $stats = [
            'total_applicants'  => Application::count(),
            'total_approved'    => Application::where('status', Application::STATUS_APPROVED)->count(),
            'total_pending'     => Application::where('status', Application::STATUS_PENDING)->count(),
            'total_rejected'    => Application::where('status', Application::STATUS_REJECTED)->count(),
            'approval_rate'     => $this->getApprovalRate(),
            'avg_score'         => round(Application::avg('score') ?? 0, 1),
            'total_reports'     => WhistleblowerReport::count(),
            'reports_resolved'  => WhistleblowerReport::where('status', WhistleblowerReport::STATUS_RESOLVED)->count(),
        ];

        // Distribusi skor untuk chart
        $scoreDistribution = Application::select(
            DB::raw('CASE
                WHEN score >= 70 THEN "Sangat Layak (≥70)"
                WHEN score >= 40 THEN "Cukup (40-69)"
                ELSE "Tidak Layak (<40)"
            END as category'),
            DB::raw('COUNT(*) as count')
        )->groupBy('category')->get();

        // Distribusi status pekerjaan untuk chart
        $employmentDistribution = Application::select('employment_status', DB::raw('COUNT(*) as count'))
            ->groupBy('employment_status')
            ->get()
            ->map(fn($item) => [
                'label' => match ($item->employment_status) {
                    'unemployed' => 'Tidak Bekerja',
                    'informal'   => 'Sektor Informal',
                    'formal'     => 'Sektor Formal',
                    default      => $item->employment_status,
                },
                'count' => $item->count,
            ]);

        return Inertia::render('Welcome', [
            'stats'                  => $stats,
            'scoreDistribution'      => $scoreDistribution,
            'employmentDistribution' => $employmentDistribution,
        ]);
    }

    private function getApprovalRate(): float
    {
        $total = Application::whereIn('status', [
            Application::STATUS_APPROVED,
            Application::STATUS_REJECTED,
        ])->count();

        if ($total === 0) return 0;

        $approved = Application::where('status', Application::STATUS_APPROVED)->count();
        return round(($approved / $total) * 100, 1);
    }
}
