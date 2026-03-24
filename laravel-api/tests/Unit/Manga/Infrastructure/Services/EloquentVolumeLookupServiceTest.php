<?php

declare(strict_types=1);

namespace Tests\Unit\Manga\Infrastructure\Services;

use App\Manga\Infrastructure\EloquentModels\Edition as EloquentEdition;
use App\Manga\Infrastructure\EloquentModels\Series as EloquentSeries;
use App\Manga\Infrastructure\EloquentModels\Volume as EloquentVolume;
use App\Manga\Infrastructure\Services\EloquentVolumeLookupService;

test('search returns series matching title', function () {
    EloquentSeries::create(['title' => 'Naruto', 'authors' => 'Masashi Kishimoto']);
    EloquentSeries::create(['title' => 'One Piece', 'authors' => 'Eiichiro Oda']);

    $service = new EloquentVolumeLookupService;
    $results = $service->search('Naruto');

    expect($results)->toHaveCount(1);
    expect($results[0]['title'])->toBe('Naruto');
    expect($results[0]['authors'])->toBe('Masashi Kishimoto');
});

test('search returns series matching authors', function () {
    EloquentSeries::create(['title' => 'Naruto', 'authors' => 'Masashi Kishimoto']);

    $service = new EloquentVolumeLookupService;
    $results = $service->search('Kishimoto');

    expect($results)->toHaveCount(1);
    expect($results[0]['title'])->toBe('Naruto');
});

test('search is case insensitive', function () {
    EloquentSeries::create(['title' => 'Naruto', 'authors' => 'Author']);

    $service = new EloquentVolumeLookupService;
    $results = $service->search('NARUTO');

    expect($results)->toHaveCount(1);
    expect($results[0]['title'])->toBe('Naruto');
});

test('search returns empty array when no match', function () {
    $service = new EloquentVolumeLookupService;
    $results = $service->search('nonexistent-xyz');

    expect($results)->toBeEmpty();
});

test('findByIsbn returns volume when found', function () {
    $series = EloquentSeries::create(['title' => 'Naruto', 'authors' => 'Author']);
    $edition = EloquentEdition::create(['series_id' => $series->id, 'name' => 'Standard', 'language' => 'fr']);
    EloquentVolume::create([
        'edition_id' => $edition->id,
        'title' => 'Naruto Vol 1',
        'isbn' => '9784088728407',
        'number' => 1,
    ]);

    $service = new EloquentVolumeLookupService;
    $result = $service->findByIsbn('9784088728407');

    expect($result)->not->toBeNull();
    expect($result['isbn'])->toBe('9784088728407');
    expect($result['title'])->toBe('Naruto Vol 1');
});

test('findByIsbn returns null when not found', function () {
    $service = new EloquentVolumeLookupService;
    $result = $service->findByIsbn('0000000000000');

    expect($result)->toBeNull();
});

test('findByApiId returns volume when found by api_id', function () {
    $series = EloquentSeries::create(['title' => 'Naruto', 'authors' => 'Author']);
    $edition = EloquentEdition::create(['series_id' => $series->id, 'name' => 'Standard', 'language' => 'fr']);
    EloquentVolume::create([
        'edition_id' => $edition->id,
        'title' => 'Naruto Vol 1',
        'api_id' => 'vol-api-001',
        'number' => 1,
    ]);

    $service = new EloquentVolumeLookupService;
    $result = $service->findByApiId('vol-api-001');

    expect($result)->not->toBeNull();
    expect($result['api_id'])->toBe('vol-api-001');
    expect($result['title'])->toBe('Naruto Vol 1');
});

test('findByApiId returns series when no volume matches api_id', function () {
    EloquentSeries::create(['title' => 'Naruto', 'authors' => 'Author', 'api_id' => 'series-api-001']);

    $service = new EloquentVolumeLookupService;
    $result = $service->findByApiId('series-api-001');

    expect($result)->not->toBeNull();
    expect($result['api_id'])->toBe('series-api-001');
    expect($result['title'])->toBe('Naruto');
});

test('findByApiId returns null when not found', function () {
    $service = new EloquentVolumeLookupService;
    $result = $service->findByApiId('nonexistent-id');

    expect($result)->toBeNull();
});
