<?php

namespace App\Manga\Application\DTOs;

class SearchMangaDTO
{
    public function __construct(
        public readonly string $query,
        public readonly int $page = 1,
        public readonly int $perPage = 15,
        public readonly ?int $userId = null,
    ) {}
}
