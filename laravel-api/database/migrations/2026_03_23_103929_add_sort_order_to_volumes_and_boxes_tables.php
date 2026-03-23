<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('volumes', function (Blueprint $table) {
            $table->decimal('sort_order', 10, 2)->default(0)->index();
        });

        Schema::table('boxes', function (Blueprint $table) {
            $table->decimal('sort_order', 10, 2)->default(0)->index();
        });

        // Initialize sort_order from existing number column
        DB::statement("UPDATE volumes SET sort_order = CAST(NULLIF(REGEXP_REPLACE(number, '[^0-9.]', '', 'g'), '') AS numeric) WHERE number ~ '^[0-9.-]+$'");
        DB::statement("UPDATE boxes SET sort_order = CAST(NULLIF(REGEXP_REPLACE(number, '[^0-9.]', '', 'g'), '') AS numeric) WHERE number ~ '^[0-9.-]+$'");
    }

    public function down(): void
    {
        Schema::table('volumes', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        Schema::table('boxes', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};
