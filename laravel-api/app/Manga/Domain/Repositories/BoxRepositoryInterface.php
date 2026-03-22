<?php

declare(strict_types=1);

namespace App\Manga\Domain\Repositories;

use App\Manga\Application\DTOs\CreateBoxDTO;
use App\Manga\Domain\Models\Box;

interface BoxRepositoryInterface
{
    public function findById(int $id, ?int $userId = null): ?Box;

    public function findByApiId(string $apiId): ?Box;

    public function findByBoxSetAndNumber(int $boxSetId, string $number): ?Box;

    public function findByBoxSetAndIsbn(int $boxSetId, string $isbn): ?Box;

    /** @return Box[] */
    public function findByBoxSetId(int $boxSetId): array;

    public function findByIsbn(string $isbn): ?Box;

    public function create(CreateBoxDTO $dto): Box;

    /** @param array<int> $volumeIds */
    public function attachVolumes(int $boxId, array $volumeIds): void;

    /** @param array<string, mixed> $data */
    public function update(int $id, array $data): void;

    public function attachToUser(int $boxId, int $userId): void;

    public function detachFromUser(int $boxId, int $userId): void;

    /**
     * @param  array<int, string>  $apiIds
     * @return array{attached: int, found: int}
     */
    public function attachByApiIdsToUser(array $apiIds, int $userId): array;

    public function isOwnedByUser(int $boxId, int $userId): bool;
}
