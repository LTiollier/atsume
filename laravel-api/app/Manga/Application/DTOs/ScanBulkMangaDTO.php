<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final class ScanBulkMangaDTO
{
    /**
     * @param  string[]  $isbns
     */
    public function __construct(
        public readonly array $isbns,
        public readonly int $userId,
    ) {}
}
