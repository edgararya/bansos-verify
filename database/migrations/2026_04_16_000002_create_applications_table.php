<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel applications menyimpan data pengajuan bantuan sosial dari warga.
     * Setiap warga (citizen) hanya bisa punya satu pengajuan aktif.
     */
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // --- Data Ekonomi & Keluarga (untuk scoring) ---
            $table->unsignedInteger('monthly_income')->default(0);       // Penghasilan bulanan (Rp)
            $table->unsignedTinyInteger('dependents')->default(0);        // Jumlah tanggungan
            $table->string('employment_status');                          // unemployed, informal, formal
            $table->string('housing_status');                             // own, rent, free, poor_condition
            $table->boolean('has_chronic_illness')->default(false);
            $table->boolean('has_disability')->default(false);

            // --- Dokumen Upload ---
            $table->string('ktp_path')->nullable();                       // Path file KTP
            $table->string('kk_path')->nullable();                        // Path file Kartu Keluarga

            // --- Scoring & Status ---
            $table->unsignedTinyInteger('score')->default(0);             // 0–100, dihitung otomatis
            $table->string('status')->default('pending');                 // pending, approved, rejected, under_review
            $table->string('rejection_reason')->nullable();
            $table->text('notes')->nullable();                            // Catatan dari Admin

            // --- Timestamps & Admin ---
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
