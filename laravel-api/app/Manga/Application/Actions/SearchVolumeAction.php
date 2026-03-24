<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Application\DTOs\SearchVolumeDTO;
use App\Manga\Domain\Models\Series;
use App\Manga\Domain\Repositories\SeriesRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

final class SearchVolumeAction
{
    public function __construct(
        private readonly SeriesRepositoryInterface $seriesRepository
    ) {}

    /**
     * @return LengthAwarePaginator<int, Series>
     */
    public function execute(SearchVolumeDTO $dto): LengthAwarePaginator
    {
        return $this->seriesRepository->search($dto->query, $dto->page, $dto->perPage, $dto->userId);
    }
}
