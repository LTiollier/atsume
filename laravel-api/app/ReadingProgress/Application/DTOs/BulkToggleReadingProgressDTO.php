<?php

declare(strict_types=1);

namespace App\ReadingProgress\Application\DTOs;

final class BulkToggleReadingProgressDTO
{
    /**
     * @param  int[]  $volumeIds
     */
    public function __construct(
        public readonly int $userId,
        public readonly array $volumeIds,
    ) {}
}
