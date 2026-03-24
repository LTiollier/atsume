<?php

declare(strict_types=1);

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\AddVolumeAction;
use App\Manga\Application\DTOs\AddVolumeDTO;
use App\Manga\Domain\Events\VolumeAddedToCollection;
use App\Manga\Domain\Exceptions\VolumeNotFoundException;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;
use App\Manga\Domain\Services\VolumeResolverServiceInterface;
use Illuminate\Support\Facades\Event;
use Mockery;

test('adds manga to collection and dispatches event', function () {
    Event::fake();

    $volume = new Volume(33, 1, 'api123', 'isbn123', '1', 'Naruto 1', null, null, null, null);

    $resolver = Mockery::mock(VolumeResolverServiceInterface::class);
    $resolver->shouldReceive('resolveByApiId')->with('api123')->once()->andReturn($volume);

    $volumeRepo = Mockery::mock(VolumeRepositoryInterface::class);
    $volumeRepo->shouldReceive('attachToUser')->with(33, 1)->once();

    $action = new AddVolumeAction($resolver, $volumeRepo);
    $dto = new AddVolumeDTO('api123', 1);

    $result = $action->execute($dto);

    expect($result->getId())->toBe(33);
    Event::assertDispatched(VolumeAddedToCollection::class);
});

test('propagates VolumeNotFoundException when api id not found', function () {
    $resolver = Mockery::mock(VolumeResolverServiceInterface::class);
    $resolver->shouldReceive('resolveByApiId')->with('invalid')->andThrow(VolumeNotFoundException::class);

    $volumeRepo = Mockery::mock(VolumeRepositoryInterface::class);

    $action = new AddVolumeAction($resolver, $volumeRepo);
    $dto = new AddVolumeDTO('invalid', 1);

    expect(fn () => $action->execute($dto))->toThrow(VolumeNotFoundException::class);
});
