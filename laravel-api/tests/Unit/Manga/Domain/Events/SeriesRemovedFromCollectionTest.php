<?php

declare(strict_types=1);

use App\Manga\Domain\Events\SeriesRemovedFromCollection;

test('SeriesRemovedFromCollection event stores seriesId and userId', function () {
    $seriesId = 123;
    $userId = 42;
    $event = new SeriesRemovedFromCollection($seriesId, $userId);

    expect($event->seriesId)->toBe($seriesId)
        ->and($event->userId)->toBe($userId);
});
