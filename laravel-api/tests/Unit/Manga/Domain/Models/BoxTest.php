<?php

use App\Manga\Domain\Models\Box;

test('box model can be instantiated and returns correct values', function () {
    $box = new Box(
        id: 1,
        box_set_id: 10,
        title: 'Box 1',
        number: '1',
        isbn: '1234567890',
        api_id: 'api-123',
        release_date: '2023-01-01',
        cover_url: 'https://example.com/cover.jpg',
        is_empty: false
    );

    expect($box->getId())->toBe(1)
        ->and($box->getBoxSetId())->toBe(10)
        ->and($box->getTitle())->toBe('Box 1')
        ->and($box->getNumber())->toBe('1')
        ->and($box->getIsbn())->toBe('1234567890')
        ->and($box->getApiId())->toBe('api-123')
        ->and($box->getReleaseDate())->toBe('2023-01-01')
        ->and($box->getCoverUrl())->toBe('https://example.com/cover.jpg')
        ->and($box->isEmpty())->toBeFalse();
});
