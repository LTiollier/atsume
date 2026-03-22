<?php

declare(strict_types=1);

namespace Tests\Unit\Manga\Domain\Listeners;

use App\Manga\Domain\Events\BoxAddedToCollection;
use App\Manga\Domain\Listeners\RemoveBoxFromWishlistOnCollection;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;
use Mockery;
use Mockery\MockInterface;

test('it removes box from wishlist when box is added to collection', function () {
    /** @var WishlistRepositoryInterface&MockInterface $repository */
    $repository = Mockery::mock(WishlistRepositoryInterface::class);

    $listener = new RemoveBoxFromWishlistOnCollection($repository);

    $event = new BoxAddedToCollection(
        boxId: 123,
        userId: 456
    );

    $repository->shouldReceive('removeWishlistItemFromUser')
        ->once()
        ->with(123, 'box', 456);

    $listener->handle($event);
});
