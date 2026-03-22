<?php

declare(strict_types=1);

use App\Manga\Application\Actions\GetBoxAction;
use App\Manga\Domain\Models\Box;
use App\Manga\Domain\Repositories\BoxRepositoryInterface;

test('it gets a box by id', function () {
    $boxRepository = Mockery::mock(BoxRepositoryInterface::class);
    $box = new Box(
        1,
        1,
        'Box 1',
        '1',
        '1234567890',
        'api_id',
        '2023-01-01',
        null,
        false,
        []
    );

    $boxRepository->shouldReceive('findById')
        ->with(1, 1)
        ->once()
        ->andReturn($box);

    $action = new GetBoxAction($boxRepository);
    $result = $action->execute(1, 1);

    expect($result)->toBe($box);
});

test('it returns null if box not found', function () {
    $boxRepository = Mockery::mock(BoxRepositoryInterface::class);
    $boxRepository->shouldReceive('findById')
        ->with(999, 1)
        ->once()
        ->andReturn(null);

    $action = new GetBoxAction($boxRepository);
    $result = $action->execute(999, 1);

    expect($result)->toBeNull();
});
