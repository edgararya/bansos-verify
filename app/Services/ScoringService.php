<?php

namespace App\Services;

use App\Models\Application;

/**
 * ScoringService - Algoritma Penilaian Kelayakan Bantuan Sosial
 *
 * Sistem scoring berbasis pembobotan parameter kemiskinan objektif.
 * Total maksimum: 100 poin
 *
 * Bobot Parameter:
 *   - Penghasilan Bulanan     : 35 poin
 *   - Jumlah Tanggungan       : 20 poin
 *   - Status Pekerjaan        : 20 poin
 *   - Kondisi Hunian          : 15 poin
 *   - Kondisi Kesehatan       : 10 poin
 *
 * Passing Grade: >= 70 poin => Layak (Eligible)
 */
class ScoringService
{
    // --- Passing grade untuk kelayakan otomatis ---
    public const PASSING_GRADE = 70;

    /**
     * Hitung skor berdasarkan data pengajuan.
     *
     * @param array $data Data pengajuan warga
     * @return int Skor 0-100
     */
    public static function calculate(array $data): int
    {
        $score = 0;

        $score += self::scoreIncome($data['monthly_income'] ?? 0);
        $score += self::scoreDependents($data['dependents'] ?? 0);
        $score += self::scoreEmployment($data['employment_status'] ?? 'formal');
        $score += self::scoreHousing($data['housing_status'] ?? 'own');
        $score += self::scoreHealth(
            $data['has_chronic_illness'] ?? false,
            $data['has_disability'] ?? false
        );

        return min($score, 100);
    }

    /**
     * Scoring Penghasilan Bulanan (Bobot: 35 poin)
     * Semakin rendah penghasilan, semakin tinggi skor.
     */
    private static function scoreIncome(int $income): int
    {
        if ($income == 0)          return 35;
        if ($income <= 500_000)    return 32;
        if ($income <= 1_000_000)  return 28;
        if ($income <= 1_500_000)  return 22;
        if ($income <= 2_000_000)  return 15;
        if ($income <= 3_000_000)  return 8;
        if ($income <= 5_000_000)  return 3;
        return 0; // > 5 juta
    }

    /**
     * Scoring Jumlah Tanggungan (Bobot: 20 poin)
     * Semakin banyak tanggungan, semakin tinggi skor.
     */
    private static function scoreDependents(int $dependents): int
    {
        if ($dependents >= 5) return 20;
        if ($dependents == 4) return 17;
        if ($dependents == 3) return 13;
        if ($dependents == 2) return 9;
        if ($dependents == 1) return 5;
        return 0;
    }

    /**
     * Scoring Status Pekerjaan (Bobot: 20 poin)
     */
    private static function scoreEmployment(string $status): int
    {
        return match ($status) {
            Application::EMPLOYMENT_UNEMPLOYED => 20,
            Application::EMPLOYMENT_INFORMAL   => 12,
            Application::EMPLOYMENT_FORMAL     => 0,
            default                            => 0,
        };
    }

    /**
     * Scoring Kondisi Hunian (Bobot: 15 poin)
     * Semakin buruk kondisi hunian, semakin tinggi skor.
     */
    private static function scoreHousing(string $status): int
    {
        return match ($status) {
            Application::HOUSING_POOR_CONDITION => 15,
            Application::HOUSING_FREE           => 10,
            Application::HOUSING_RENT           => 6,
            Application::HOUSING_OWN            => 0,
            default                             => 0,
        };
    }

    /**
     * Scoring Kondisi Kesehatan (Bobot: 10 poin)
     */
    private static function scoreHealth(bool $chronicIllness, bool $disability): int
    {
        $score = 0;
        if ($chronicIllness) $score += 5;
        if ($disability)     $score += 5;
        return $score;
    }

    /**
     * Dapatkan breakdown detail skor per komponen.
     * Berguna untuk menampilkan transparansi scoring ke warga.
     */
    public static function getBreakdown(array $data): array
    {
        return [
            'income'      => [
                'label' => 'Penghasilan Bulanan',
                'score' => self::scoreIncome($data['monthly_income'] ?? 0),
                'max'   => 35,
            ],
            'dependents'  => [
                'label' => 'Jumlah Tanggungan',
                'score' => self::scoreDependents($data['dependents'] ?? 0),
                'max'   => 20,
            ],
            'employment'  => [
                'label' => 'Status Pekerjaan',
                'score' => self::scoreEmployment($data['employment_status'] ?? 'formal'),
                'max'   => 20,
            ],
            'housing'     => [
                'label' => 'Kondisi Hunian',
                'score' => self::scoreHousing($data['housing_status'] ?? 'own'),
                'max'   => 15,
            ],
            'health'      => [
                'label' => 'Kondisi Kesehatan',
                'score' => self::scoreHealth(
                    $data['has_chronic_illness'] ?? false,
                    $data['has_disability'] ?? false
                ),
                'max'   => 10,
            ],
            'total'       => self::calculate($data),
            'is_eligible' => self::calculate($data) >= self::PASSING_GRADE,
        ];
    }
}
