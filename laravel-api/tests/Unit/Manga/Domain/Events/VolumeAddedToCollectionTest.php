<?php

declare(strict_types=1);

use App\Manga\Domain\Events\VolumeAddedToCollection;
use App\Manga\Domain\Models\Volume;

test('VolumeAddedToCollection event stores volume and userId', function () {
    $volume = new Volume(
        id: 1,
        editionId: 2,
        apiId: 'api123',
        isbn: '123456',
        number: '1',
        title: 'Title',

        publishedDate: null,

        coverUrl: null
    );

    $userId = 42;
    $event = new VolumeAddedToCollection($volume, $userId);

    expect($event->volume)->toBe($volume)
        ->and($event->userId)->toBe($userId);
});
