<?php

declare(strict_types=1);

namespace App\Manga\Infrastructure\Services;

interface VolumeLookupServiceInterface
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function search(string $query): array;

    /**
     * @return array<string, mixed>|null
     */
    public function findByIsbn(string $isbn): ?array;

    /**
     * @return array<string, mixed>|null
     */
    public function findByApiId(string $apiId): ?array;
}
