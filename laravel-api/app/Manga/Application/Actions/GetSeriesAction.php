<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Domain\Models\Series;
use App\Manga\Domain\Repositories\SeriesRepositoryInterface;

final class GetSeriesAction
{
    public function __construct(
        private readonly SeriesRepositoryInterface $seriesRepository
    ) {}

    public function execute(int $id, ?int $userId = null): ?Series
    {
        return $this->seriesRepository->findById($id, $userId);
    }
}
