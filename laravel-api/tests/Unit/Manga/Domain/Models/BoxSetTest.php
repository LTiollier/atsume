<?php

use App\Manga\Domain\Models\BoxSet;

test('box set model can be instantiated and returns correct values', function () {
    $boxSet = new BoxSet(
        id: 1,
        series_id: 10,
        title: 'Box Set 1',
        publisher: 'Kana',
        api_id: 'api-123'
    );

    expect($boxSet->getId())->toBe(1)
        ->and($boxSet->getSeriesId())->toBe(10)
        ->and($boxSet->getTitle())->toBe('Box Set 1')
        ->and($boxSet->getPublisher())->toBe('Kana')
        ->and($boxSet->getApiId())->toBe('api-123');
});
