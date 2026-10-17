<?php

namespace App\Http\Controllers\Citizen;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Services\ScoringService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    /**
     * Dashboard utama warga - status & breakdown skor.
     */
    public function dashboard()
    {
        $user        = auth()->user();
        $application = $user->application()->first();

        $scoreBreakdown = null;
        if ($application) {
            $scoreBreakdown = ScoringService::getBreakdown($application->toArray());
        }

        return Inertia::render('Citizen/Dashboard', [
            'user'           => $user,
            'application'    => $application,
            'scoreBreakdown' => $scoreBreakdown,
            'passingGrade'   => ScoringService::PASSING_GRADE,
        ]);
    }

    /**
     * Form pengajuan/update data warga.
     */
    public function edit()
    {
        $user        = auth()->user();
        $application = $user->application()->first();

        return Inertia::render('Citizen/UpdateData', [
            'user'        => $user,
            'application' => $application,
        ]);
    }

    /**
     * Simpan atau update data pengajuan, hitung skor otomatis.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'monthly_income'     => ['required', 'integer', 'min:0'],
            'dependents'         => ['required', 'integer', 'min:0', 'max:20'],
            'employment_status'  => ['required', 'in:unemployed,informal,formal'],
            'housing_status'     => ['required', 'in:poor_condition,free,rent,own'],
            'has_chronic_illness'=> ['required', 'boolean'],
            'has_disability'     => ['required', 'boolean'],
            'ktp'                => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
            'kk'                 => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
        ]);

        // Hitung skor otomatis
        $score = ScoringService::calculate($validated);

        // Handle file uploads
        $ktpPath = null;
        $kkPath  = null;
        if ($request->hasFile('ktp')) {
            $ktpPath = $request->file('ktp')->store("documents/{$user->id}", 'private');
        }
        if ($request->hasFile('kk')) {
            $kkPath = $request->file('kk')->store("documents/{$user->id}", 'private');
        }

        // Update or create application
        $appData = [
            'monthly_income'      => $validated['monthly_income'],
            'dependents'          => $validated['dependents'],
            'employment_status'   => $validated['employment_status'],
            'housing_status'      => $validated['housing_status'],
            'has_chronic_illness' => $validated['has_chronic_illness'],
            'has_disability'      => $validated['has_disability'],
            'score'               => $score,
            'status'              => Application::STATUS_PENDING,
        ];

        if ($ktpPath) $appData['ktp_path'] = $ktpPath;
        if ($kkPath)  $appData['kk_path']  = $kkPath;

        $user->application()->updateOrCreate(['user_id' => $user->id], $appData);

        return redirect()->route('citizen.dashboard')
            ->with('success', "Data berhasil disimpan. Skor kelayakan Anda: {$score}/100");
    }
}
