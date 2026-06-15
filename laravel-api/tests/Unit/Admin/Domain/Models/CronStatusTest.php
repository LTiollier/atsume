<?php

use App\Admin\Domain\Models\CronStatus;

it('stores and returns values correctly', function () {
    $now = now()->toIso8601String();
    $status = new CronStatus($now, 5, 'sync');

    expect($status->getLastRunAt())->toBe($now)
        ->and($status->getFailedJobsCount())->toBe(5)
        ->and($status->getLastRunType())->toBe('sync');
});

it('can be converted to an array', function () {
    $now = now()->toIso8601String();
    $status = new CronStatus($now, 5, 'sync');

    expect($status->toArray())->toBe([
        'last_run_at' => $now,
        'failed_jobs_count' => 5,
        'last_run_type' => 'sync',
    ]);
});

it('handles null values', function () {
    $status = new CronStatus(null, 0);

    expect($status->getLastRunAt())->toBeNull()
        ->and($status->getFailedJobsCount())->toBe(0)
        ->and($status->getLastRunType())->toBeNull();
});
