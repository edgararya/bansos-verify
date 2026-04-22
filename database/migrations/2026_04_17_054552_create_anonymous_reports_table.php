<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anonymous_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('reporter_name')->nullable();
            $table->string('category')->nullable();
            $table->string('location')->nullable();
            $table->text('description');
            $table->boolean('is_anonymous')->default(true);
            $table->string('risk_level')->default('Medium');
            $table->string('status')->default('Menunggu');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anonymous_reports');
    }
};
