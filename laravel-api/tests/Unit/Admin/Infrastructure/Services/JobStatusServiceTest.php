<?php

use App\Admin\Infrastructure\Services\JobStatusService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

it('tracks a run in cache', function () {
    $service = new JobStatusService;
    $service->trackRun('test:command');

    expect(Cache::get(JobStatusService::LAST_CRON_RUN_KEY))->not->toBeNull()
        ->and(Cache::get(JobStatusService::LAST_CRON_TYPE_KEY))->toBe('test:command');
});

it('returns cron status correctly', function () {
    $now = now()->toIso8601String();
    Cache::put(JobStatusService::LAST_CRON_RUN_KEY, $now);
    Cache::put(JobStatusService::LAST_CRON_TYPE_KEY, 'test:command');

    DB::table('failed_jobs')->insert([
        'uuid' => (string) str()->uuid(),
        'connection' => 'database',
        'queue' => 'default',
        'payload' => '{}',
        'exception' => 'error',
        'failed_at' => now(),
    ]);

    $service = new JobStatusService;
    $status = $service->getCronStatus();

    expect($status->getLastRunAt())->toBe($now)
        ->and($status->getLastRunType())->toBe('test:command')
        ->and($status->getFailedJobsCount())->toBe(1);
});
