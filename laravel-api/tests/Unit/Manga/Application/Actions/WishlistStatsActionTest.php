<?php

declare(strict_types=1);

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\WishlistStatsAction;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;
use Mockery;

test('it returns total distinct volumes count for user wishlist', function () {
    $wishlistRepository = Mockery::mock(WishlistRepositoryInterface::class);
    $wishlistRepository->shouldReceive('countTotalVolumesByUserId')->with(1)->andReturn(12);

    $action = new WishlistStatsAction($wishlistRepository);

    expect($action->execute(1))->toBe(12);
});
