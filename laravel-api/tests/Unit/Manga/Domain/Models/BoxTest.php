<?php

use App\Manga\Domain\Models\Box;

test('box model can be instantiated and returns correct values', function () {
    $box = new Box(
        1,
        10,
        'Box 1',
        '1',
        '1234567890',
        'api-123',
        '2023-01-01',
        'https://example.com/cover.jpg',
        false
    );

    expect($box->getId())->toBe(1);
    expect($box->getBoxSetId())->toBe(10);
    expect($box->getTitle())->toBe('Box 1');
    expect($box->getNumber())->toBe('1');
    expect($box->getIsbn())->toBe('1234567890');
    expect($box->getApiId())->toBe('api-123');
    expect($box->getReleaseDate())->toBe('2023-01-01');
    expect($box->getCoverUrl())->toBe('https://example.com/cover.jpg');
    expect($box->isEmpty())->toBeFalse();
});
