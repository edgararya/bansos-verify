<?php

namespace App\Http\Controllers\Citizen;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CitizenDashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        // Check if disbursements method exists, otherwise return empty collection
        $history = method_exists($user, 'disbursements') 
            ? $user->disbursements()->orderByDesc('disbursed_at')->get()->map(fn($d) => [
                'program'  => $d->program,
                'tanggal'  => $d->disbursed_at->format('d M Y'),
                'nominal'  => 'Rp ' . number_format($d->amount, 0, ',', '.'),
            ])
            : collect([]);

        return Inertia::render('Citizen/CitizenDashboard', [
            'bansos_status' => $user->bansos_status ?? 'MENUNGGU VERIFIKASI',
            'citizen_info'  => [
                'nama'    => $user->name,
                'nik'    => $user->nik,
                'alamat'  => $user->address,
                'program' => $user->program ?? 'Bantuan Pangan Non Tunai (BPNT)',
            ],
            'history' => $history,
        ]);
    }
}
