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
     * @return LengthAwarePaginator<int, Series>
     */
    public function search(string $query, int $page = 1, int $perPage = 15, ?int $userId = null): LengthAwarePaginator;

    /** @param array<string, mixed> $data */
    public function update(int $id, array $data): void;
}
