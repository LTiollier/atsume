<?php

declare(strict_types=1);

use App\Manga\Domain\Events\VolumeRemovedFromCollection;

test('VolumeRemovedFromCollection event stores volumeIds and userId', function () {
    $volumeIds = [1, 2, 3];
    $userId = 42;
    $event = new VolumeRemovedFromCollection($volumeIds, $userId);

    expect($event->volumeIds)->toBe($volumeIds)
        ->and($event->userId)->toBe($userId);
});
