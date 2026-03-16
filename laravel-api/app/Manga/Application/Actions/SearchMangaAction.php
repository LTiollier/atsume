<?php

namespace App\Manga\Application\Actions;

use App\Manga\Application\DTOs\SearchMangaDTO;
use App\Manga\Domain\Models\Series;
use App\Manga\Domain\Repositories\SeriesRepositoryInterface;

class SearchMangaAction
{
    public function __construct(
        private readonly SeriesRepositoryInterface $seriesRepository
    ) {}

    /**
     * @return Series[]
     */
    public function execute(SearchMangaDTO $dto): array
    {
        return $this->seriesRepository->search($dto->query);
    }
}
