<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final class CreateSeriesDTO
{
    public function __construct(
        public readonly string $title,
        public readonly ?string $authors = null,
        public readonly ?string $apiId = null,
    ) {}
}
