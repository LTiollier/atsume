<?php

namespace Tests\Unit\Manga\Infrastructure\Repositories;

use App\Manga\Application\DTOs\CreateSeriesDTO;
use App\Manga\Domain\Models\Series;
use App\Manga\Infrastructure\EloquentModels\Edition as EloquentEdition;
use App\Manga\Infrastructure\EloquentModels\Series as EloquentSeries;
use App\Manga\Infrastructure\EloquentModels\Volume as EloquentVolume;
use App\Manga\Infrastructure\Repositories\EloquentSeriesRepository;
use App\User\Infrastructure\EloquentModels\User;

test('findById returns series', function () {
    $eloquent = EloquentSeries::create(['title' => 'Test Series', 'authors' => 'Test']);

    $repo = new EloquentSeriesRepository;
    $result = $repo->findById($eloquent->id);

    expect($result)->toBeInstanceOf(Series::class);
    expect($result->getId())->toBe($eloquent->id);
});

test('findByApiId returns series', function () {
    $eloquent = EloquentSeries::create(['title' => 'Test Series', 'api_id' => 'api123', 'authors' => 'Test']);

    $repo = new EloquentSeriesRepository;
    $result = $repo->findByApiId('api123');

    expect($result)->toBeInstanceOf(Series::class);
    expect($result->getId())->toBe($eloquent->id);
});

test('creates a series', function () {
    $repo = new EloquentSeriesRepository;
    $result = $repo->create(new CreateSeriesDTO('Test Series', 'Test'));

    expect($result)->toBeInstanceOf(Series::class);
    expect($result->getTitle())->toBe('Test Series');
    expect(EloquentSeries::find($result->getId()))->not->toBeNull();
});

test('search returns series with editions', function () {
    $eloquent = EloquentSeries::create(['title' => 'Naruto', 'authors' => 'Masashi Kishimoto']);
    EloquentEdition::create([
        'series_id' => $eloquent->id,
        'name' => 'Édition Standard',
        'publisher' => 'Kana',
        'total_volumes' => 72,
    ]);

    $repo = new EloquentSeriesRepository;
    $result = $repo->search('Naruto')->first();

    expect($result)->toBeInstanceOf(Series::class)
        ->and($result->getEditions())->toHaveCount(1)
        ->and($result->getEditions()[0]->getName())->toBe('Édition Standard');
});

test('search with userId returns possessed count in editions', function () {
    $user = User::factory()->create();
    $eloquent = EloquentSeries::create(['title' => 'One Piece', 'authors' => 'Eiichiro Oda']);
    $edition = EloquentEdition::create([
        'series_id' => $eloquent->id,
        'name' => 'Édition Standard',
        'publisher' => 'Glénat',
        'total_volumes' => 107,
    ]);
    $volume = EloquentVolume::create([
        'edition_id' => $edition->id,
        'api_id' => 'v1',
        'title' => 'One Piece T1',
        'number' => '1',
        'isbn' => null,
        'cover_url' => null,
        'published_date' => null,
    ]);
    $user->volumes()->attach($volume->id);

    $repo = new EloquentSeriesRepository;
    $result = $repo->search('One Piece', userId: $user->id)->first();

    expect($result->getEditions()[0]->getPossessedCount())->toBe(1);
});
