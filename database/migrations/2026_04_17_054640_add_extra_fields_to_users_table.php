<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('occupation')->nullable()->after('address');
            $table->decimal('monthly_income', 15, 2)->nullable()->after('occupation');
            $table->string('ktp_photo')->nullable()->after('monthly_income');
            $table->string('bansos_status')->default('MENUNGGU VERIFIKASI')->after('ktp_photo');
            $table->string('program')->nullable()->after('bansos_status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['occupation', 'monthly_income', 'ktp_photo', 'bansos_status', 'program']);
        });
    }
};
