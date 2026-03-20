<?php

namespace App\Manga\Application\Actions;

use App\Manga\Application\DTOs\SearchMangaDTO;
use App\Manga\Domain\Models\Series;
use App\Manga\Domain\Repositories\SeriesRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class SearchMangaAction
{
    public function __construct(
        private readonly SeriesRepositoryInterface $seriesRepository
    ) {}

    /**
     * @return LengthAwarePaginator<int, Series>
     */
    public function execute(SearchMangaDTO $dto): LengthAwarePaginator
    {
        return $this->seriesRepository->search($dto->query, $dto->page, $dto->perPage, $dto->userId);
    }
}
