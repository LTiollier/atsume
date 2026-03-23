<?php

declare(strict_types=1);

use App\Manga\Domain\Events\BoxRemovedFromCollection;

test('BoxRemovedFromCollection event stores boxId and userId', function () {
    $boxId = 555;
    $userId = 42;
    $event = new BoxRemovedFromCollection($boxId, $userId);

    expect($event->boxId)->toBe($boxId)
        ->and($event->userId)->toBe($userId);
});
