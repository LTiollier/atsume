<?php

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\AddScannedMangaToWishlistAction;
use App\Manga\Application\DTOs\ScanMangaDTO;
use App\Manga\Application\Services\VolumeResolverService;
use App\Manga\Domain\Exceptions\MangaNotFoundException;
use App\Manga\Domain\Models\Edition;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\EditionRepositoryInterface;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;
use Mockery;

test('adds existing scanned manga to user wishlist (stores edition)', function () {
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
        total_volumes: null,
    );

    $resolver = Mockery::mock(VolumeResolverService::class);
    $resolver->shouldReceive('resolveByIsbn')->with('1234567890123')->once()->andReturn($volume);

    $wishlistRepo = Mockery::mock(WishlistRepositoryInterface::class);
    $wishlistRepo->shouldReceive('addEditionWishlistToUser')->with(5, 1)->once();

    $editionRepo = Mockery::mock(EditionRepositoryInterface::class);
    $editionRepo->shouldReceive('findById')->with(5, 1)->once()->andReturn($edition);

    $action = new AddScannedMangaToWishlistAction($resolver, $editionRepo, $wishlistRepo);
    $dto = new ScanMangaDTO(isbn: '1234567890123', userId: 1);

    $result = $action->execute($dto);

    expect($result)->toBe($edition);
});

test('propagates MangaNotFoundException when volume cannot be resolved for wishlist', function () {
    $resolver = Mockery::mock(VolumeResolverService::class);
    $resolver->shouldReceive('resolveByIsbn')->with('invalid')->andThrow(MangaNotFoundException::class);

    $wishlistRepo = Mockery::mock(WishlistRepositoryInterface::class);
    $editionRepo = Mockery::mock(EditionRepositoryInterface::class);

    $action = new AddScannedMangaToWishlistAction($resolver, $editionRepo, $wishlistRepo);
    $dto = new ScanMangaDTO(isbn: 'invalid', userId: 1);

    expect(fn () => $action->execute($dto))->toThrow(MangaNotFoundException::class);
});
