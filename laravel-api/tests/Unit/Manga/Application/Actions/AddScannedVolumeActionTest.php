<?php

declare(strict_types=1);

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\AddScannedVolumeAction;
use App\Manga\Application\DTOs\ScanVolumeDTO;
use App\Manga\Domain\Events\VolumeAddedToCollection;
use App\Manga\Domain\Exceptions\VolumeNotFoundException;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;
use App\Manga\Domain\Services\VolumeResolverServiceInterface;
use Illuminate\Support\Facades\Event;
use Mockery;

test('adds scanned manga to collection and dispatches event', function () {
    Event::fake();

    $volume = new Volume(33, 1, 'api123', '9781234567890', '1', 'Naruto 1', null, null, null, null);

    $resolver = Mockery::mock(VolumeResolverServiceInterface::class);
    $resolver->shouldReceive('resolveByIsbn')->with('9781234567890')->once()->andReturn($volume);

    $volumeRepo = Mockery::mock(VolumeRepositoryInterface::class);
    $volumeRepo->shouldReceive('attachToUser')->with(33, 1)->once();

    $action = new AddScannedVolumeAction($resolver, $volumeRepo);
    $dto = new ScanVolumeDTO('9781234567890', 1);

    $result = $action->execute($dto);

    expect($result->getId())->toBe(33);
    Event::assertDispatched(VolumeAddedToCollection::class);
});

test('propagates VolumeNotFoundException when volume cannot be resolved', function () {
    $resolver = Mockery::mock(VolumeResolverServiceInterface::class);
    $resolver->shouldReceive('resolveByIsbn')->with('invalid')->andThrow(VolumeNotFoundException::class);

    $volumeRepo = Mockery::mock(VolumeRepositoryInterface::class);

    $action = new AddScannedVolumeAction($resolver, $volumeRepo);
    $dto = new ScanVolumeDTO('invalid', 1);

    expect(fn () => $action->execute($dto))->toThrow(VolumeNotFoundException::class);
});
