<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

class AddMangaDTO
{
    public function __construct(
        public readonly string $api_id,
        public readonly int $userId,
    ) {}
}
