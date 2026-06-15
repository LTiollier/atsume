<?php

use App\Admin\Domain\Models\AdminStats;

it('stores and returns values correctly', function () {
    $stats = new AdminStats(1, 2, 3);

    expect($stats->getNewSeriesCount())->toBe(1)
        ->and($stats->getNewEditionsCount())->toBe(2)
        ->and($stats->getNewVolumesCount())->toBe(3);
});

it('can be converted to an array', function () {
    $stats = new AdminStats(1, 2, 3);

    expect($stats->toArray())->toBe([
        'new_series' => 1,
        'new_editions' => 2,
        'new_volumes' => 3,
    ]);
});
