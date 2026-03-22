<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final class BulkRemoveVolumesDTO
{
    /**
     * @param  int[]  $volumeIds
     */
    public function __construct(
        public readonly array $volumeIds,
        public readonly int $userId,
    ) {}
}
