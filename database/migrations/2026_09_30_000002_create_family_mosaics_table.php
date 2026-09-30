<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('family_mosaics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('family_member_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->text('caption');
            $table->string('photo_path');
            $table->string('thumbnail_path');
            $table->date('activity_date')->nullable();
            $table->timestamps();

            $table->index('family_member_id');
            $table->index('activity_date');
            $table->index('created_at');
        });

        Schema::create('family_mosaic_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_mosaic_id')->constrained('family_mosaics')->cascadeOnDelete();
            $table->foreignId('family_member_id')->constrained('family_members')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['family_mosaic_id', 'family_member_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_mosaic_members');
        Schema::dropIfExists('family_mosaics');
    }
};
