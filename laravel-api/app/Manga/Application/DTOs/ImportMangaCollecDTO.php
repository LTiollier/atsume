<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final class ImportMangaCollecDTO
{
    public function __construct(
        public readonly string $username,
        public readonly int $userId,
    ) {}
}
