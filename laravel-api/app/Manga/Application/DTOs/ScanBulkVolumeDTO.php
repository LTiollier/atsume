<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class ScanBulkVolumeDTO
{
    /**
     * @param  string[]  $isbns
     */
    public function __construct(
        public array $isbns,
        public int $userId,
    ) {}
}
