<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\User;
use App\Models\WhistleblowerReport;
use App\Services\ScoringService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ===== Admin Account =====
        User::create([
            'name'     => 'Admin Bansos',
            'email'    => 'admin@bansos.test',
            'password' => Hash::make('password'),
            'role'     => User::ROLE_ADMIN,
            'nik'      => '1234567890123456',
        ]);

        // ===== Auditor Account =====
        User::create([
            'name'     => 'Auditor Independen',
            'email'    => 'auditor@bansos.test',
            'password' => Hash::make('password'),
            'role'     => User::ROLE_AUDITOR,
        ]);

        // ===== Demo Citizens with Applications =====
        $citizens = [
            [
                'name'    => 'Siti Aminah',
                'email'   => 'siti@bansos.test',
                'nik'     => '3201010101010001',
                'phone'   => '081234567890',
                'address' => 'Jl. Mawar No. 12, Bogor',
                'app'     => [
                    'monthly_income'      => 0,
                    'dependents'          => 5,
                    'employment_status'   => 'unemployed',
                    'housing_status'      => 'poor_condition',
                    'has_chronic_illness' => true,
                    'has_disability'      => false,
                ],
            ],
            [
                'name'    => 'Budi Santoso',
                'email'   => 'budi@bansos.test',
                'nik'     => '3201010101010002',
                'phone'   => '081234567891',
                'address' => 'Jl. Melati No. 5, Depok',
                'app'     => [
                    'monthly_income'      => 800000,
                    'dependents'          => 3,
                    'employment_status'   => 'informal',
                    'housing_status'      => 'rent',
                    'has_chronic_illness' => false,
                    'has_disability'      => false,
                ],
            ],
            [
                'name'    => 'Dewi Lestari',
                'email'   => 'dewi@bansos.test',
                'nik'     => '3201010101010003',
                'phone'   => '081234567892',
                'address' => 'Jl. Kenanga No. 8, Bekasi',
                'app'     => [
                    'monthly_income'      => 1200000,
                    'dependents'          => 4,
                    'employment_status'   => 'informal',
                    'housing_status'      => 'free',
                    'has_chronic_illness' => true,
                    'has_disability'      => true,
                ],
            ],
            [
                'name'    => 'Ahmad Fauzi',
                'email'   => 'ahmad@bansos.test',
                'nik'     => '3201010101010004',
                'phone'   => '081234567893',
                'address' => 'Jl. Anggrek No. 3, Tangerang',
                'app'     => [
                    'monthly_income'      => 4500000,
                    'dependents'          => 1,
                    'employment_status'   => 'formal',
                    'housing_status'      => 'own',
                    'has_chronic_illness' => false,
                    'has_disability'      => false,
                ],
            ],
            [
                'name'    => 'Ratna Wulandari',
                'email'   => 'ratna@bansos.test',
                'nik'     => '3201010101010005',
                'phone'   => '081234567894',
                'address' => 'Jl. Dahlia No. 17, Jakarta Timur',
                'app'     => [
                    'monthly_income'      => 500000,
                    'dependents'          => 2,
                    'employment_status'   => 'informal',
                    'housing_status'      => 'poor_condition',
                    'has_chronic_illness' => false,
                    'has_disability'      => true,
                ],
            ],
        ];

        foreach ($citizens as $citizenData) {
            $appData = $citizenData['app'];
            $score   = ScoringService::calculate($appData);

            $user = User::create([
                'name'     => $citizenData['name'],
                'email'    => $citizenData['email'],
                'password' => Hash::make('password'),
                'role'     => User::ROLE_CITIZEN,
                'nik'      => $citizenData['nik'],
                'phone'    => $citizenData['phone'],
                'address'  => $citizenData['address'],
            ]);

            $user->application()->create(array_merge($appData, [
                'score'  => $score,
                'status' => Application::STATUS_PENDING,
            ]));
        }

        // ===== Sample Whistleblower Reports =====
        WhistleblowerReport::create([
            'reported_subject' => 'Ketua RT 005 Kelurahan Cipondoh',
            'report_type'      => 'nepotism',
            'location'         => 'Kelurahan Cipondoh, Kota Tangerang',
            'description'      => 'Diduga membagikan bansos hanya kepada keluarga dan kerabat dekat, sementara warga miskin yang sudah mendaftar tidak mendapatkan bantuan sejak 3 bulan lalu. Beberapa warga telah mencoba melapor ke kelurahan namun tidak ditindaklanjuti.',
            'status'           => WhistleblowerReport::STATUS_OPEN,
        ]);

        WhistleblowerReport::create([
            'reported_subject' => 'Oknum Petugas Verifikasi Kecamatan Cibinong',
            'report_type'      => 'data_manipulation',
            'location'         => 'Kecamatan Cibinong, Kabupaten Bogor',
            'description'      => 'Diduga memanipulasi data penghasilan pada formulir pengajuan. Beberapa warga yang sebenarnya tidak bekerja tercatat memiliki penghasilan tinggi sehingga skor mereka rendah dan tidak layak menerima bantuan. Dugaan kami ada imbalan uang yang diterima oknum tersebut.',
            'status'           => WhistleblowerReport::STATUS_INVESTIGATING,
        ]);

        WhistleblowerReport::create([
            'reported_subject' => 'Lurah Desa Sukamaju',
            'report_type'      => 'fraud',
            'location'         => 'Desa Sukamaju, Kabupaten Sukabumi',
            'description'      => 'Bantuan senilai Rp500.000 per kepala keluarga dipotong menjadi Rp200.000 oleh oknum saat penyaluran tunai. Warga yang menerima diancam tidak akan mendapat bantuan di periode berikutnya jika melaporkan.',
            'status'           => WhistleblowerReport::STATUS_OPEN,
        ]);
    }
}
