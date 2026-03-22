<?php

declare(strict_types=1);

use App\Manga\Domain\Events\EditionAddedToCollection;
use App\Manga\Domain\Listeners\RemoveEditionFromWishlistOnCollection;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;
use Mockery;

test('it removes edition from wishlist when edition is added to collection', function () {
    /** @var WishlistRepositoryInterface&Mockery\MockInterface $repository */
    $repository = Mockery::mock(WishlistRepositoryInterface::class);

    $listener = new RemoveEditionFromWishlistOnCollection($repository);

    $event = new EditionAddedToCollection(
        editionId: 789,
        userId: 101112
    );

    $repository->shouldReceive('removeWishlistItemFromUser')
        ->once()
        ->with(789, 'edition', 101112);

    $listener->handle($event);
});
