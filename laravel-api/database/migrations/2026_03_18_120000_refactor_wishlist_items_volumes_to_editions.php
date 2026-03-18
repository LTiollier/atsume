<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Convert existing 'volume' wishlist items to 'edition' items
        // Group by user_id to deduplicate (multiple volumes from same edition)
        $volumeItems = DB::table('wishlist_items')
            ->where('wishlistable_type', 'volume')
            ->get();

        $editionItemsToInsert = [];

        foreach ($volumeItems as $item) {
            $volume = DB::table('volumes')->where('id', $item->wishlistable_id)->first();
            if (! $volume) {
                continue;
            }

            $key = $item->user_id.'_'.$volume->edition_id;
            if (! isset($editionItemsToInsert[$key])) {
                $editionItemsToInsert[$key] = [
                    'user_id' => $item->user_id,
                    'wishlistable_type' => 'edition',
                    'wishlistable_id' => $volume->edition_id,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            }
        }

        foreach ($editionItemsToInsert as $data) {
            DB::table('wishlist_items')->insertOrIgnore($data);
        }

        // Remove old volume entries
        DB::table('wishlist_items')->where('wishlistable_type', 'volume')->delete();
    }

    public function down(): void
    {
        // Cannot reliably reverse this migration (we'd need to pick a volume per edition)
        // No-op rollback
    }
};
