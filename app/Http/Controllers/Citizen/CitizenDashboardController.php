<?php

namespace App\Http\Controllers\Citizen;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Schedule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CitizenDashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        // Ambil status dari tabel applications (yang diupdate oleh Admin)
        $application = Application::where('user_id', $user->id)->latest()->first();

        // Mapping status aplikasi ke label yang ditampilkan di dashboard warga
        $bansosStatus = match ($application?->status) {
            'approved'     => 'DITERIMA',
            'rejected'     => 'DITOLAK',
            'under_review' => 'MENUNGGU VERIFIKASI',
            'pending'      => 'MENUNGGU VERIFIKASI',
            default        => ($user->bansos_status ?? 'MENUNGGU VERIFIKASI'),
        };

        // Catatan penolakan (jika ditolak)
        $catatanTolak = ($application?->status === 'rejected')
            ? ($application->rejection_reason ?? 'Data tidak memenuhi kriteria kelayakan.')
            : null;

        $history = $user->disbursements()
            ->orderByDesc('disbursed_at')
            ->get()
            ->map(fn($d) => [
                'program' => $d->program,
                'tanggal' => $d->disbursed_at ? $d->disbursed_at->format('d M Y') : '-',
                'nominal' => 'Rp ' . number_format($d->amount, 0, ',', '.'),
            ]);

        // Ambil jadwal pengambilan yang akan datang (hari ini & ke depan)
        $jadwal = Schedule::where('date', '>=', today())
            ->orderBy('date')
            ->get()
            ->map(fn($s) => [
                'id'      => $s->id,
                'tanggal' => \Carbon\Carbon::parse($s->date)->translatedFormat('l, d F Y'),
                'lokasi'  => $s->location,
                'pesan'   => $s->message,
            ]);

        return Inertia::render('Citizen/CitizenDashboard', [
            'bansos_status' => $bansosStatus,
            'catatan_tolak' => $catatanTolak,
            'skor'          => $application?->score,
            'jadwal'        => $jadwal,
            'citizen_info'  => [
                'nama'    => $user->name,
                'nik'     => $user->nik,
                'alamat'  => $user->address ?? '-',
                'program' => $user->program ?? 'Bantuan Pangan Non Tunai (BPNT)',
            ],
            'history' => $history,
        ]);
    }
}
