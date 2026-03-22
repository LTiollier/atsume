<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class ScanMangaDTO
{
    public function __construct(
        public string $isbn,
        public int $userId,
    ) {}
}
