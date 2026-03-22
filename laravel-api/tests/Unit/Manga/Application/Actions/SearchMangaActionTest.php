<?php

declare(strict_types=1);

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\SearchMangaAction;
use App\Manga\Application\DTOs\SearchMangaDTO;
use App\Manga\Domain\Models\Series;
use App\Manga\Domain\Repositories\SeriesRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery;

test('searches manga via local repository without user', function () {
    $seriesRepo = Mockery::mock(SeriesRepositoryInterface::class);

    $series = new Series(1, 'api1', 'Naruto', 'Masashi Kishimoto', 'url');
    $paginator = new LengthAwarePaginator([$series], 1, 15, 1);
    $seriesRepo->shouldReceive('search')->with('Naruto', 1, 15, null)->andReturn($paginator);

    $action = new SearchMangaAction($seriesRepo);
    $dto = new SearchMangaDTO('Naruto');
    $result = $action->execute($dto);

    expect($result)->toBe($paginator);
});

test('searches manga via local repository with authenticated user', function () {
    $seriesRepo = Mockery::mock(SeriesRepositoryInterface::class);

    $series = new Series(1, 'api1', 'Naruto', 'Masashi Kishimoto', 'url');
    $paginator = new LengthAwarePaginator([$series], 1, 15, 1);
    $seriesRepo->shouldReceive('search')->with('Naruto', 1, 15, 42)->andReturn($paginator);

    $action = new SearchMangaAction($seriesRepo);
    $dto = new SearchMangaDTO('Naruto', userId: 42);
    $result = $action->execute($dto);

    expect($result)->toBe($paginator);
});
