<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

class ScanMangaDTO
{
    public function __construct(
        public readonly string $isbn,
        public readonly int $userId,
    ) {}
}
