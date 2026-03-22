<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class CreateSeriesDTO
{
    public function __construct(
        public string $title,
        public ?string $authors = null,
        public ?string $apiId = null,
    ) {}
}
