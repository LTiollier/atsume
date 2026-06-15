<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Manga\Infrastructure\EloquentModels\Edition;
use App\Manga\Infrastructure\EloquentModels\Series;
use App\Manga\Infrastructure\EloquentModels\Volume;
use Illuminate\Database\Seeder;

class AdminDashboardSeeder extends Seeder
{
    public function run(): void
    {
        // Create some fresh data for this month's stats
        $series = Series::factory()->count(5)->create(['created_at' => now()]);

        $series->each(function (Series $s) {
            $editions = Edition::factory()->count(2)->create([
                'series_id' => $s->id,
                'created_at' => now(),
            ]);

            $editions->each(function (Edition $e) {
                Volume::factory()->count(10)->create([
                    'edition_id' => $e->id,
                    'created_at' => now(),
                ]);
            });
        });
    }
}
