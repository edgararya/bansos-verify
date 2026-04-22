<?php

namespace App\Http\Controllers\Citizen;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PemutakhiranDataController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Citizen/PemutakhiranData');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'pekerjaan'  => ['required', 'string', 'max:100'],
            'penghasilan' => ['required', 'numeric', 'min:0'],
            'ktp_photo'  => ['nullable', 'image', 'max:2048'],
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->occupation     = $request->pekerjaan;
        $user->monthly_income = $request->penghasilan;

        if ($request->hasFile('ktp_photo')) {
            $path = $request->file('ktp_photo')->store('ktp', 'public');
            $user->ktp_photo = $path;
        }

        $user->bansos_status = 'MENUNGGU VERIFIKASI';
        $user->save();

        return back()->with('success', 'Data berhasil diperbarui.');
    }
}
