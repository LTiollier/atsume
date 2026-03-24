<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            UPDATE volumes
            SET sort_order = CAST(NULLIF(REGEXP_REPLACE(number, '[^0-9.]', '', 'g'), '') AS numeric)
            WHERE sort_order = 0
              AND number ~ '^[0-9.]+$'
        ");

        DB::statement("
            UPDATE boxes
            SET sort_order = CAST(NULLIF(REGEXP_REPLACE(number, '[^0-9.]', '', 'g'), '') AS numeric)
            WHERE sort_order = 0
              AND number ~ '^[0-9.]+$'
        ");
    }

    public function down(): void {}
};
