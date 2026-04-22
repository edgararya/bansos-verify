<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel whistleblower_reports untuk laporan anonim.
     * TIDAK ada relasi ke user_id untuk menjaga anonimitas pelapor.
     */
    public function up(): void
    {
        Schema::create('whistleblower_reports', function (Blueprint $table) {
            $table->id();

            // --- Identitas Target Laporan (bukan pelapor) ---
            $table->string('reported_subject');        // Nama/pihak yang dilaporkan
            $table->string('report_type');             // fraud, data_manipulation, nepotism, other
            $table->string('location')->nullable();    // Kelurahan/desa lokasi kejadian

            // --- Konten Laporan ---
            $table->text('description');               // Deskripsi kejadian
            $table->string('evidence_path')->nullable(); // Optional: foto/file bukti

            // --- Status Investigasi ---
            $table->string('status')->default('open'); // open, investigating, resolved, dismissed
            $table->text('investigator_note')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');

            // Timestamp dibuat, TANPA user_id (anonimitas!)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('whistleblower_reports');
    }
};
