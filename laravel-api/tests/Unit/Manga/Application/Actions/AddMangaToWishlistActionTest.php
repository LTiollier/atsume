<?php

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\AddWishlistItemAction;
use App\Manga\Application\DTOs\AddWishlistItemDTO;
use App\Manga\Domain\Exceptions\MangaNotFoundException;
use App\Manga\Domain\Models\Edition;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\BoxRepositoryInterface;
use App\Manga\Domain\Repositories\BoxSetRepositoryInterface;
use App\Manga\Domain\Repositories\EditionRepositoryInterface;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;
use Mockery;

test('it throws an exception if item is not found in database', function () {
    $volumeRepository = Mockery::mock(VolumeRepositoryInterface::class);
    $volumeRepository->shouldReceive('findByApiId')->with('missing-api-id')->andReturn(null);

    $boxSetRepository = Mockery::mock(BoxSetRepositoryInterface::class);
    $boxSetRepository->shouldReceive('findByApiId')->with('missing-api-id')->andReturn(null);

    $boxRepository = Mockery::mock(BoxRepositoryInterface::class);
    $boxRepository->shouldReceive('findByApiId')->with('missing-api-id')->andReturn(null);

    $editionRepository = Mockery::mock(EditionRepositoryInterface::class);
    $wishlistRepository = Mockery::mock(WishlistRepositoryInterface::class);

    $action = new AddWishlistItemAction($volumeRepository, $boxRepository, $boxSetRepository, $editionRepository, $wishlistRepository);
    $dto = new AddWishlistItemDTO(api_id: 'missing-api-id', userId: 1);

    expect(fn () => $action->execute($dto))->toThrow(MangaNotFoundException::class);
});

test('it wishlists the edition when adding by volume api_id', function () {
    $volume = new Volume(
        id: 1,
        edition_id: 5,
        api_id: 'test-api-id',
        isbn: '1234567890123',
        number: '1',
        title: 'Test Manga',
        published_date: null,
        cover_url: null,
    );

    $edition = new Edition(
        id: 5,
        series_id: 1,
        name: 'Edition Standard',
        publisher: null,
        language: 'fr',
        total_volumes: 10,
    );

    $volumeRepository = Mockery::mock(VolumeRepositoryInterface::class);
    $volumeRepository->shouldReceive('findByApiId')->with('test-api-id')->andReturn($volume);

    $editionRepository = Mockery::mock(EditionRepositoryInterface::class);
    $editionRepository->shouldReceive('findById')->with(5, 1)->andReturn($edition);

    $wishlistRepository = Mockery::mock(WishlistRepositoryInterface::class);
    $wishlistRepository->shouldReceive('addEditionWishlistToUser')->with(5, 1)->once();

    $boxRepository = Mockery::mock(BoxRepositoryInterface::class);
    $boxSetRepository = Mockery::mock(BoxSetRepositoryInterface::class);

    $action = new AddWishlistItemAction($volumeRepository, $boxRepository, $boxSetRepository, $editionRepository, $wishlistRepository);
    $dto = new AddWishlistItemDTO(api_id: 'test-api-id', userId: 1);

    $result = $action->execute($dto);

    expect($result)->toBe($edition);
});
