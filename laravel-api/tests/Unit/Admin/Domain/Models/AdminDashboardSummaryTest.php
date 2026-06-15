<?php

use App\Admin\Domain\Models\AdminDashboardSummary;
use App\Admin\Domain\Models\AdminStats;
use App\Admin\Domain\Models\CronStatus;

it('stores and returns models correctly', function () {
    $stats = new AdminStats(1, 2, 3);
    $cronStatus = new CronStatus(null, 0);
    $summary = new AdminDashboardSummary($stats, $cronStatus);

    expect($summary->getStats())->toBe($stats)
        ->and($summary->getCronStatus())->toBe($cronStatus);
});
