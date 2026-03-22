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
        Schema::table('volumes', function (Blueprint $table) {
            $table->dropColumn(['description', 'page_count']);
        });

        Schema::table('series', function (Blueprint $table) {
            $table->dropColumn(['status', 'total_volumes', 'description']);
        });

        Schema::table('editions', function (Blueprint $table) {
            $table->boolean('is_finished')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('volumes', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->integer('page_count')->nullable();
        });

        Schema::table('series', function (Blueprint $table) {
            $table->string('status')->nullable();
            $table->integer('total_volumes')->nullable();
            $table->text('description')->nullable();
        });

        Schema::table('editions', function (Blueprint $table) {
            $table->dropColumn('is_finished');
        });
    }
};
