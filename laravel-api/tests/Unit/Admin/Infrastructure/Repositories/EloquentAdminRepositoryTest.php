<?php

use App\Admin\Infrastructure\Repositories\EloquentAdminRepository;
use App\Manga\Infrastructure\EloquentModels\Edition;
use App\Manga\Infrastructure\EloquentModels\Series;
use App\Manga\Infrastructure\EloquentModels\Volume;
use Illuminate\Support\Facades\DB;

it('returns monthly stats correctly', function () {
    // Create data for this month
    Series::factory()->count(2)->create(['created_at' => now()]);
    // Note: Edition and Volume factories create Series/Edition automatically,
    // so we use recycle or just accept higher counts if they aren't strictly isolated.
    // Here we just want to verify the repository counts correctly.

    $repository = new EloquentAdminRepository;
    $stats = $repository->getMonthlyStats();

    expect($stats->getNewSeriesCount())->toBeGreaterThanOrEqual(2);
});

it('returns failed jobs count', function () {
    DB::table('failed_jobs')->insert([
        'uuid' => (string) str()->uuid(),
        'connection' => 'database',
        'queue' => 'default',
        'payload' => '{}',
        'exception' => 'error',
        'failed_at' => now(),
    ]);

    $repository = new EloquentAdminRepository;
    expect($repository->getFailedJobsCount())->toBeGreaterThanOrEqual(1);
});
