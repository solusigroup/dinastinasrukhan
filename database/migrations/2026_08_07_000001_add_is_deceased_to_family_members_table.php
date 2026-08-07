<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('family_members', function (Blueprint $table) {
            $table->boolean('is_deceased')->default(false)->after('death_date');
        });

        // Auto-set is_deceased for existing records that have a death_date
        DB::table('family_members')->whereNotNull('death_date')->update(['is_deceased' => true]);
    }

    public function down(): void
    {
        Schema::table('family_members', function (Blueprint $table) {
            $table->dropColumn('is_deceased');
        });
    }
};
