<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AnonymousReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LaporanAnonimController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'category'      => ['required', 'string'],
            'location'      => ['required', 'string', 'max:200'],
            'description'   => ['required', 'string', 'min:20', 'max:2000'],
            'is_anonymous'  => ['boolean'],
            'reporter_name' => ['nullable', 'string', 'max:100'],
        ]);

        AnonymousReport::create([
            'reporter_name' => $request->is_anonymous ? null : $request->reporter_name,
            'category'      => $request->category,
            'location'      => $request->location,
            'description'   => $request->description,
            'is_anonymous'  => $request->is_anonymous ?? true,
            'risk_level'    => 'Medium',
            'status'        => 'Menunggu',
        ]);

        return back()->with('success', 'Laporan berhasil dikirim. Terima kasih atas partisipasi Anda.');
    }
}
