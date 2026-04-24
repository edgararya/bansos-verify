<?php

namespace App\Http\Controllers\Citizen;

use App\Http\Controllers\Controller;
use App\Models\Application;
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
            'pekerjaan'        => ['required', 'string', 'max:100'],
            'penghasilan'      => ['required', 'numeric', 'min:0'],
            'tanggungan'       => ['required', 'integer', 'min:0', 'max:20'],
            'status_rumah'     => ['required', 'in:own,rent,free,poor_condition'],
            'penyakit_kronis'  => ['nullable', 'boolean'],
            'disabilitas'      => ['nullable', 'boolean'],
            'ktp_photo'        => ['nullable', 'image', 'max:2048'],
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Simpan ke user juga
        $user->occupation     = $request->pekerjaan;
        $user->monthly_income = $request->penghasilan;

        $ktpPath = null;
        if ($request->hasFile('ktp_photo')) {
            $ktpPath      = $request->file('ktp_photo')->store('ktp', 'public');
            $user->ktp_photo = $ktpPath;
        }

        $user->bansos_status = 'MENUNGGU VERIFIKASI';
        $user->save();

        // Hitung skor kelayakan (0-100)
        $score = $this->calculateScore(
            employment: $request->pekerjaan,
            income:     (int) $request->penghasilan,
            dependents: (int) $request->tanggungan,
            housing:    $request->status_rumah,
            chronic:    (bool) ($request->penyakit_kronis ?? false),
            disability: (bool) ($request->disabilitas ?? false),
        );

        // Buat atau update record di tabel applications
        Application::updateOrCreate(
            ['user_id' => $user->id],
            [
                'employment_status'  => $request->pekerjaan,
                'monthly_income'     => (int) $request->penghasilan,
                'dependents'         => (int) $request->tanggungan,
                'housing_status'     => $request->status_rumah,
                'has_chronic_illness'=> (bool) ($request->penyakit_kronis ?? false),
                'has_disability'     => (bool) ($request->disabilitas ?? false),
                'ktp_path'           => $ktpPath ?? optional(Application::where('user_id', $user->id)->first())->ktp_path,
                'score'              => $score,
                'status'             => 'pending',
            ]
        );

        return back()->with('success', 'Data berhasil diperbarui. Permohonan Anda kini masuk dalam antrian verifikasi.');
    }

    /**
     * Hitung skor kelayakan berdasarkan kondisi ekonomi warga.
     * Semakin tinggi skor = semakin layak dapat bantuan.
     */
    private function calculateScore(
        string $employment,
        int    $income,
        int    $dependents,
        string $housing,
        bool   $chronic,
        bool   $disability,
    ): int {
        $score = 0;

        // --- Komponen Status Pekerjaan (30 poin maks) ---
        $score += match (strtolower(trim($employment))) {
            'unemployed', 'tidak bekerja', 'pengangguran' => 30,
            'informal', 'buruh', 'petani', 'pedagang kecil', 'pedagang', 'ibu rumah tangga' => 25,
            'formal', 'karyawan', 'pns', 'pegawai negeri', 'pegawai swasta' => 5,
            default => 20, // informal lainnya
        };

        // --- Komponen Penghasilan Bulanan (40 poin maks) ---
        if ($income == 0)                   $score += 40;
        elseif ($income <= 500_000)         $score += 35;
        elseif ($income <= 1_000_000)       $score += 28;
        elseif ($income <= 2_000_000)       $score += 18;
        elseif ($income <= 3_500_000)       $score += 8;
        else                                $score += 0;

        // --- Komponen Jumlah Tanggungan (15 poin maks) ---
        if ($dependents >= 4)       $score += 15;
        elseif ($dependents === 3)  $score += 12;
        elseif ($dependents === 2)  $score += 8;
        elseif ($dependents === 1)  $score += 4;
        // 0 tanggungan = 0 poin

        // --- Komponen Kondisi Rumah (10 poin maks) ---
        $score += match ($housing) {
            'poor_condition' => 10,
            'free'           => 7,
            'rent'           => 4,
            'own'            => 0,
            default          => 3,
        };

        // --- Bonus Kondisi Kesehatan (5 poin maks) ---
        if ($chronic)    $score += 3;
        if ($disability) $score += 2;

        return min(100, $score);
    }
}
