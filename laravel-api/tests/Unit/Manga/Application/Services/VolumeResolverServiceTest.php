<?php

namespace Tests\Unit\Manga\Application\Services;

use App\Manga\Application\Services\VolumeResolverService;
use App\Manga\Domain\Exceptions\MangaNotFoundException;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;
use Mockery;

// --- resolveByIsbn ---

test('resolveByIsbn returns existing volume from repository', function () {
    $volume = new Volume(1, 1, null, '9781234567890', '1', 'Naruto 1', null, null, null);

    $volumeRepo = Mockery::mock(VolumeRepositoryInterface::class);

    $volumeRepo->shouldReceive('findByIsbn')->with('9781234567890')->andReturn($volume);

    $service = new VolumeResolverService($volumeRepo);

    expect($service->resolveByIsbn('9781234567890'))->toBe($volume);
});


test('resolveByIsbn throws MangaNotFoundException when not found in DB', function () {
    $volumeRepo = Mockery::mock(VolumeRepositoryInterface::class);

    $volumeRepo->shouldReceive('findByIsbn')->andReturn(null);

    $service = new VolumeResolverService($volumeRepo);

    expect(fn () => $service->resolveByIsbn('invalid'))->toThrow(MangaNotFoundException::class);
});

// --- resolveByApiId ---

test('resolveByApiId returns existing volume from repository', function () {
    $volume = new Volume(1, 1, 'api123', null, '1', 'Naruto 1', null, null, null);

    $volumeRepo = Mockery::mock(VolumeRepositoryInterface::class);

    $volumeRepo->shouldReceive('findByApiId')->with('api123')->andReturn($volume);

    $service = new VolumeResolverService($volumeRepo);

    expect($service->resolveByApiId('api123'))->toBe($volume);
});

test('resolveByApiId throws MangaNotFoundException when not found in DB', function () {
    $volumeRepo = Mockery::mock(VolumeRepositoryInterface::class);

    $volumeRepo->shouldReceive('findByApiId')->andReturn(null);

    $service = new VolumeResolverService($volumeRepo);

    expect(fn () => $service->resolveByApiId('invalid'))->toThrow(MangaNotFoundException::class);
});
