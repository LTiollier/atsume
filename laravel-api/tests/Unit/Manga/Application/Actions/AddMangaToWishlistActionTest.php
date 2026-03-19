<?php

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\AddBoxToWishlistAction;
use App\Manga\Domain\Exceptions\MangaNotFoundException;
use App\Manga\Domain\Models\Box;
use App\Manga\Domain\Repositories\BoxRepositoryInterface;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;
use Mockery;

test('adds box to user wishlist and returns it', function () {
    $box = new Box(
        id: 2,
        box_set_id: 1,
        title: 'Box 1',
        number: '1',
        isbn: null,
        api_id: null,
        release_date: null,
        cover_url: null,
        is_empty: false,
    );

    $boxRepository = Mockery::mock(BoxRepositoryInterface::class);
    $boxRepository->shouldReceive('findById')->with(2, 1)->once()->andReturn($box);

    $wishlistRepository = Mockery::mock(WishlistRepositoryInterface::class);
    $wishlistRepository->shouldReceive('addBoxWishlistToUser')->with(2, 1)->once();

    $action = new AddBoxToWishlistAction($boxRepository, $wishlistRepository);
    $result = $action->execute(2, 1);

    expect($result)->toBe($box);
});

test('throws MangaNotFoundException when box does not exist', function () {
    $boxRepository = Mockery::mock(BoxRepositoryInterface::class);
    $boxRepository->shouldReceive('findById')->with(99, 1)->once()->andReturn(null);

    $wishlistRepository = Mockery::mock(WishlistRepositoryInterface::class);
    $wishlistRepository->shouldNotReceive('addBoxWishlistToUser');

    $action = new AddBoxToWishlistAction($boxRepository, $wishlistRepository);

    expect(fn () => $action->execute(99, 1))->toThrow(MangaNotFoundException::class);
});
