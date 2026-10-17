<?php

namespace App\Http\Controllers;

use App\Models\WhistleblowerReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WhistleblowerController extends Controller
{
    /**
     * Tampilkan form laporan anonim (tanpa login).
     */
    public function create()
    {
        return Inertia::render('Whistleblower/Create');
    }

    /**
     * Simpan laporan - tidak menyimpan identitas pelapor.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reported_subject' => ['required', 'string', 'max:255'],
            'report_type'      => ['required', 'in:fraud,data_manipulation,nepotism,other'],
            'location'         => ['nullable', 'string', 'max:255'],
            'description'      => ['required', 'string', 'min:50', 'max:5000'],
            'evidence'         => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'], // 5MB
        ]);

        $evidencePath = null;
        if ($request->hasFile('evidence')) {
            // Simpan dengan nama acak agar tidak bisa dilacak ke pelapor
            $evidencePath = $request->file('evidence')->store('whistleblower', 'private');
        }

        // Buat laporan TANPA user_id / session link
        WhistleblowerReport::create([
            'reported_subject' => $validated['reported_subject'],
            'report_type'      => $validated['report_type'],
            'location'         => $validated['location'] ?? null,
            'description'      => $validated['description'],
            'evidence_path'    => $evidencePath,
            'status'           => WhistleblowerReport::STATUS_OPEN,
        ]);

        return redirect()->route('whistleblower.create')
            ->with('success', 'Laporan Anda telah berhasil dikirim secara anonim. Terima kasih atas kepedulian Anda.');
    }
}
