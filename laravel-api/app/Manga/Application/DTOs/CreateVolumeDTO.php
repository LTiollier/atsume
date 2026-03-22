<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class CreateVolumeDTO
{
    public function __construct(
        public int $editionId,
        public string $title,
        public ?string $number = null,
        public ?string $isbn = null,
        public ?string $apiId = null,
        public ?string $publishedDate = null,
        public ?string $coverUrl = null,
    ) {}
}
