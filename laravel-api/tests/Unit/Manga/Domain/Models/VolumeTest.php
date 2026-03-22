<?php

declare(strict_types=1);

use App\Manga\Domain\Models\Edition;
use App\Manga\Domain\Models\Series;
use App\Manga\Domain\Models\Volume;

test('volume model can be instantiated and returns correct values', function () {
    $edition = new Edition(1, 10, 'Standard', 'Kana', 'fr', 20);
    $series = new Series(10, 'api-series', 'Naruto', 'Masashi Kishimoto', 'url');

    $volume = new Volume(
        id: 1,
        editionId: 2,
        apiId: 'api123',
        isbn: '9781234567890',
        number: '1',
        title: 'Naruto Vol. 1',
        publishedDate: '2000-01-01',
        coverUrl: 'http://example.com/volume1.jpg',
        edition: $edition,
        series: $series
    );

    expect($volume->getId())->toBe(1)
        ->and($volume->getEditionId())->toBe(2)
        ->and($volume->getApiId())->toBe('api123')
        ->and($volume->getIsbn())->toBe('9781234567890')
        ->and($volume->getNumber())->toBe('1')
        ->and($volume->getTitle())->toBe('Naruto Vol. 1')
        ->and($volume->getPublishedDate())->toBe('2000-01-01')
        ->and($volume->getCoverUrl())->toBe('http://example.com/volume1.jpg')
        ->and($volume->getEdition())->toBe($edition)
        ->and($volume->getSeries())->toBe($series)
        ->and($volume->isOwned())->toBeFalse()
        ->and($volume->isLoaned())->toBeFalse()
        ->and($volume->getLoanedTo())->toBeNull();
});

test('volume model can be instantiated with ownership and loan flags', function () {
    $volume = new Volume(
        id: 2,
        editionId: 1,
        apiId: null,
        isbn: '1234567890123',
        number: '2',
        title: 'Bleach Vol. 2',
        publishedDate: null,
        coverUrl: null,
        isOwned: true,
        isLoaned: true,
        loanedTo: 'John',
    );

    expect($volume->isOwned())->toBeTrue()
        ->and($volume->isLoaned())->toBeTrue()
        ->and($volume->getLoanedTo())->toBe('John');
});
