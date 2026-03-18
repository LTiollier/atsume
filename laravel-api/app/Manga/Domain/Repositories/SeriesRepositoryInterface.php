<?php

namespace App\Manga\Domain\Repositories;

use App\Manga\Application\DTOs\CreateSeriesDTO;
use App\Manga\Domain\Models\Series;
use Illuminate\Pagination\LengthAwarePaginator;

interface SeriesRepositoryInterface
{
    public function findById(int $id, ?int $userId = null): ?Series;

    public function findByApiId(string $apiId): ?Series;

    public function create(CreateSeriesDTO $dto): Series;

    /**
     * @return LengthAwarePaginator<Series>
     */
    public function search(string $query, int $page = 1, int $perPage = 15): LengthAwarePaginator;
}
