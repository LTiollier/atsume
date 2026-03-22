<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class SearchMangaDTO
{
    public function __construct(
        public string $query,
        public int $page = 1,
        public int $perPage = 15,
        public ?int $userId = null,
    ) {}
}
