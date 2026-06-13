<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Resynchronise PostgreSQL identity sequences with the current MAX(id) of each table.
 *
 * Rows were imported with explicit `id` values (see MangaDataSeeder / data restore),
 * which does NOT advance the underlying sequence in PostgreSQL. As a result
 * `nextval('<table>_id_seq')` kept returning low, already-used ids and every insert
 * (e.g. EloquentEditionRepository::create) threw:
 *   - SQLSTATE[23505] duplicate key value violates unique constraint "<table>_pkey"
 *   - SQLSTATE[25P02] in failed sql transaction (cascade on the daemon's reused connection)
 *
 * This migration walks every sequence owned by a column in the `public` schema and
 * fast-forwards it past the largest existing id.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        /** @var array<int, object{table_name: string, column_name: string, sequence_name: string}> $sequences */
        $sequences = DB::select("
            SELECT
                t.relname AS table_name,
                a.attname AS column_name,
                s.relname AS sequence_name
            FROM pg_class s
            JOIN pg_depend d ON d.objid = s.oid
            JOIN pg_class t ON t.oid = d.refobjid
            JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = d.refobjsubid
            WHERE s.relkind = 'S'
              AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        ");

        foreach ($sequences as $seq) {
            /** @var int|float|string|null $maxId */
            $maxId = DB::table($seq->table_name)->max($seq->column_name);

            if ($maxId === null) {
                // Empty table: next nextval() must return 1.
                DB::statement("SELECT setval('".$seq->sequence_name."', 1, false)");
            } else {
                // is_called = true -> next nextval() returns maxId + 1.
                DB::statement("SELECT setval('".$seq->sequence_name."', ?, true)", [(int) $maxId]);
            }
        }
    }

    public function down(): void
    {
        // Irreversible: resynchronising sequences is always safe to keep.
    }
};
