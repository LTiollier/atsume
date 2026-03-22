<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class BulkRemoveVolumesDTO
{
    /**
     * @param  int[]  $volumeIds
     */
    public function __construct(
        public array $volumeIds,
        public int $userId,
    ) {}
}
