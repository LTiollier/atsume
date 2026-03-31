<?php

declare(strict_types=1);

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
        Schema::table('series', function (Blueprint $table) {
            $table->string('authors')->nullable()->change();
        });

        Schema::table('volumes', function (Blueprint $table) {
            $table->string('authors')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE series ALTER COLUMN authors TYPE json USING to_json(authors)');
            DB::statement('ALTER TABLE volumes ALTER COLUMN authors TYPE json USING to_json(authors)');
        } else {
            Schema::table('series', function (Blueprint $table) {
                $table->json('authors')->nullable()->change();
            });

            Schema::table('volumes', function (Blueprint $table) {
                $table->json('authors')->nullable()->change();
            });
        }
    }
};
