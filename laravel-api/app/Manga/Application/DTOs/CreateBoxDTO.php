<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class CreateBoxDTO
{
    public function __construct(
        public int $boxSetId,
        public string $title,
        public ?string $number = null,
        public ?string $isbn = null,
        public ?string $apiId = null,
        public ?string $releaseDate = null,
        public ?string $coverUrl = null,
        public bool $isEmpty = false,
    ) {}
}
