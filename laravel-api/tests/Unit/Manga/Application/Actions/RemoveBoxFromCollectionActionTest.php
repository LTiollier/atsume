<?php

use App\Manga\Application\Actions\RemoveBoxFromCollectionAction;
use App\Manga\Domain\Models\Box;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\BoxRepositoryInterface;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;

test('removes box and its volumes from user collection', function () {
    $boxRepository = Mockery::mock(BoxRepositoryInterface::class);
    $volumeRepository = Mockery::mock(VolumeRepositoryInterface::class);

    $volume1 = Mockery::mock(Volume::class);
    $volume1->shouldReceive('getId')->andReturn(101);
    $volume2 = Mockery::mock(Volume::class);
    $volume2->shouldReceive('getId')->andReturn(102);

    $box = new Box(
        1,
        1,
        'Test Box',
        '1',
        'isbn-box',
        'api-box',
        null,
        null,
        false,
        [$volume1, $volume2]
    );

    $boxRepository->shouldReceive('findById')->with(1, 1)->andReturn($box);
    $boxRepository->shouldReceive('detachFromUser')->with(1, 1)->once();
    $volumeRepository->shouldReceive('detachFromUser')->with(101, 1)->once();
    $volumeRepository->shouldReceive('detachFromUser')->with(102, 1)->once();

    $action = new RemoveBoxFromCollectionAction($boxRepository, $volumeRepository);

    $action->execute(1, 1);
});
