<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class CreateBoxSetDTO
{
    public function __construct(
        public int $seriesId,
        public string $title,
        public ?string $publisher = null,
        public ?string $apiId = null,
    ) {}
}
