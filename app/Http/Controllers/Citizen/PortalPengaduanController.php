<?php

namespace App\Http\Controllers\Citizen;

use App\Http\Controllers\Controller;
use App\Models\AnonymousReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PortalPengaduanController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $complaints = AnonymousReport::where('reporter_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'tanggal'  => $r->created_at->format('d M Y'),
                'kategori' => $r->category,
                'lokasi'   => $r->location,
                'status'   => $r->status,
            ]);

        return Inertia::render('Citizen/PortalPengaduan', [
            'complaints' => $complaints,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'kategori'     => ['required', 'string'],
            'lokasi'       => ['required', 'string', 'max:200'],
            'deskripsi'    => ['required', 'string', 'min:20', 'max:2000'],
            'is_anonymous' => ['boolean'],
        ]);

        $user = Auth::user();

        AnonymousReport::create([
            'reporter_id'   => $user->id,
            'reporter_name' => $request->is_anonymous ? null : $user->name,
            'category'      => $request->kategori,
            'location'      => $request->lokasi,
            'description'   => $request->deskripsi,
            'is_anonymous'  => $request->is_anonymous ?? true,
            'risk_level'    => 'Medium',
            'status'        => 'Menunggu',
        ]);

        return back()->with('success', 'Laporan berhasil dikirim.');
    }
}
