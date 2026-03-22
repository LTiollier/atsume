<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class ImportMangaCollecDTO
{
    public function __construct(
        public string $username,
        public int $userId,
    ) {}
}
