<?php

declare(strict_types=1);

namespace App\ReadingProgress\Application\DTOs;

final readonly class BulkToggleReadingProgressDTO
{
    /**
     * @param  int[]  $volumeIds
     */
    public function __construct(
        public int $userId,
        public array $volumeIds,
    ) {}
}
