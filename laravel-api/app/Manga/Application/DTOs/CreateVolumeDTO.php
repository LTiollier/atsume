<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final class CreateVolumeDTO
{
    public function __construct(
        public readonly int $editionId,
        public readonly string $title,
        public readonly ?string $number = null,
        public readonly ?string $isbn = null,
        public readonly ?string $apiId = null,
        public readonly ?string $publishedDate = null,
        public readonly ?string $coverUrl = null,
    ) {}
}
