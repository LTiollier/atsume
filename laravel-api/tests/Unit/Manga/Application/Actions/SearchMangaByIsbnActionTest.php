<?php

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\SearchMangaByIsbnAction;
use App\Manga\Domain\Exceptions\MangaNotFoundException;
use App\Manga\Domain\Models\Volume;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;
use Mockery;

test('returns volume when isbn matches', function () {
    $volumeRepo = Mockery::mock(VolumeRepositoryInterface::class);

    $volume = new Volume(1, 1, 'api-001', '9782723492843', '1', 'One Piece Tome 1', '1999-09-01', 'https://example.com/cover.jpg');
    $volumeRepo->shouldReceive('findByIsbnWithRelations')->with('9782723492843')->andReturn($volume);

    $action = new SearchMangaByIsbnAction($volumeRepo);
    $result = $action->execute('9782723492843');

    expect($result)->toBe($volume);
});

test('throws MangaNotFoundException when isbn not found', function () {
    $volumeRepo = Mockery::mock(VolumeRepositoryInterface::class);
    $volumeRepo->shouldReceive('findByIsbnWithRelations')->with('0000000000000')->andReturn(null);

    $action = new SearchMangaByIsbnAction($volumeRepo);

    expect(fn () => $action->execute('0000000000000'))->toThrow(MangaNotFoundException::class);
});
