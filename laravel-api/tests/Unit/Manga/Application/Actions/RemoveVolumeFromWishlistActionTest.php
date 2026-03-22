<?php

declare(strict_types=1);

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\RemoveVolumeFromWishlistAction;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;
use Mockery;

test('it removes edition from wishlist', function () {
    $wishlistRepository = Mockery::mock(WishlistRepositoryInterface::class);
    $wishlistRepository->shouldReceive('removeWishlistItemFromUser')->with(1, 'edition', 1)->once();

    $action = new RemoveVolumeFromWishlistAction($wishlistRepository);

    $action->execute(1, 'edition', 1);
});
