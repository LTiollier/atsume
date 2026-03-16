<?php

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\SearchMangaAction;
use App\Manga\Application\DTOs\SearchMangaDTO;
use App\Manga\Domain\Models\Series;
use App\Manga\Domain\Repositories\SeriesRepositoryInterface;
use Mockery;

test('searches manga via local repository', function () {
    $seriesRepo = Mockery::mock(SeriesRepositoryInterface::class);

    $series = new Series(1, 'api1', 'Naruto', 'Masashi Kishimoto', 'url');
    $searchResult = [$series];
    $seriesRepo->shouldReceive('search')->with('Naruto')->andReturn($searchResult);

    $action = new SearchMangaAction($seriesRepo);
    $dto = new SearchMangaDTO('Naruto');
    $result = $action->execute($dto);

    expect($result)->toBe($searchResult);
});
