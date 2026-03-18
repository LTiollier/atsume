<?php

namespace Tests\Unit\Manga\Infrastructure\Mappers;

use App\Manga\Domain\Models\Box;
use App\Manga\Infrastructure\EloquentModels\Box as EloquentBox;
use App\Manga\Infrastructure\Mappers\BoxMapper;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('BoxMapper toDomain maps all fields', function () {
    $eloquent = new EloquentBox([
        'box_set_id' => 1,
        'title' => 'Test Box',
        'number' => '1',
        'isbn' => '123456',
        'api_id' => 'api-123',
        'release_date' => '2023-01-01',
        'cover_url' => 'https://example.com/cover.jpg',
        'is_empty' => false,
    ]);
    $eloquent->id = 1;

    $domain = BoxMapper::toDomain($eloquent);

    expect($domain)->toBeInstanceOf(Box::class)
        ->and($domain->getId())->toBe(1)
        ->and($domain->getBoxSetId())->toBe(1)
        ->and($domain->getTitle())->toBe('Test Box')
        ->and($domain->getNumber())->toBe('1')
        ->and($domain->getIsbn())->toBe('123456')
        ->and($domain->getApiId())->toBe('api-123')
        ->and($domain->getReleaseDate())->toBe('2023-01-01')
        ->and($domain->getCoverUrl())->toBe('https://example.com/cover.jpg')
        ->and($domain->isEmpty())->toBeFalse();
});

test('BoxMapper toDomain maps nullable fields as null', function () {
    $eloquent = new EloquentBox([
        'box_set_id' => 1,
        'title' => 'Test Box',
        'is_empty' => true,
    ]);
    $eloquent->id = 1;

    $domain = BoxMapper::toDomain($eloquent);

    expect($domain->getNumber())->toBeNull()
        ->and($domain->getIsbn())->toBeNull()
        ->and($domain->getApiId())->toBeNull()
        ->and($domain->getReleaseDate())->toBeNull()
        ->and($domain->getCoverUrl())->toBeNull();
});
