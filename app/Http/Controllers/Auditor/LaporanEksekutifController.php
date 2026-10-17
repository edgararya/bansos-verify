<?php

namespace App\Http\Controllers\Auditor;

use App\Http\Controllers\Controller;
use App\Models\Disbursement;
use App\Models\AnonymousReport;
use App\Models\Application;
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
                'value' => number_format(Application::whereNotNull('score')->avg('score'), 1) . '%',
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
        $applications = Application::with('user')->get();

        return response()->streamDownload(function () use ($applications) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Nama', 'NIK', 'Pekerjaan', 'Penghasilan', 'Skor', 'Status']);
            foreach ($applications as $a) {
                fputcsv($out, [
                    $a->user->name,
                    $a->user->nik,
                    $a->employment_status,
                    $a->monthly_income,
                    $a->score,
                    $a->status
                ]);
            }
            fclose($out);
        }, 'data-kelurahan-' . now()->format('Ymd') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
