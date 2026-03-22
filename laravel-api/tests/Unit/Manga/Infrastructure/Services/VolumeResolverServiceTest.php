<?php

declare(strict_types=1);

use App\Manga\Domain\Exceptions\MangaNotFoundException;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;
use App\Manga\Infrastructure\Services\VolumeResolverService;
use Mockery\MockInterface;

test('it resolves volume by isbn', function () {
    /** @var VolumeRepositoryInterface&MockInterface $repository */
    $repository = Mockery::mock(VolumeRepositoryInterface::class);
    $service = new VolumeResolverService($repository);

    $volume = new Volume(
        id: 1,
        editionId: 1,
        apiId: 'api-123',
        isbn: '1234567890123',
        number: '1',
        title: 'Volume 1',
        publishedDate: null,
        coverUrl: null
    );

    $repository->shouldReceive('findByIsbn')
        ->once()
        ->with('1234567890123')
        ->andReturn($volume);

    expect($service->resolveByIsbn('1234567890123'))->toBe($volume);
});

test('it throws exception when volume is not found by isbn', function () {
    /** @var VolumeRepositoryInterface&MockInterface $repository */
    $repository = Mockery::mock(VolumeRepositoryInterface::class);
    $service = new VolumeResolverService($repository);

    $repository->shouldReceive('findByIsbn')
        ->once()
        ->with('unknown')
        ->andReturn(null);

    $service->resolveByIsbn('unknown');
})->throws(MangaNotFoundException::class, 'Manga not found locally for barcode: unknown');

test('it resolves volume by api id', function () {
    /** @var VolumeRepositoryInterface&MockInterface $repository */
    $repository = Mockery::mock(VolumeRepositoryInterface::class);
    $service = new VolumeResolverService($repository);

    $volume = new Volume(
        id: 1,
        editionId: 1,
        apiId: 'api-123',
        isbn: '1234567890123',
        number: '1',
        title: 'Volume 1',
        publishedDate: null,
        coverUrl: null
    );

    $repository->shouldReceive('findByApiId')
        ->once()
        ->with('api-123')
        ->andReturn($volume);

    expect($service->resolveByApiId('api-123'))->toBe($volume);
});

test('it throws exception when volume is not found by api id', function () {
    /** @var VolumeRepositoryInterface&MockInterface $repository */
    $repository = Mockery::mock(VolumeRepositoryInterface::class);
    $service = new VolumeResolverService($repository);

    $repository->shouldReceive('findByApiId')
        ->once()
        ->with('api-unknown')
        ->andReturn(null);

    $service->resolveByApiId('api-unknown');
})->throws(MangaNotFoundException::class, 'Manga not found locally with ID: api-unknown');
