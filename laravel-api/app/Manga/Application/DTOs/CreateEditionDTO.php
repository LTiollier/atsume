<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

class CreateEditionDTO
{
    public function __construct(
        public readonly int $seriesId,
        public readonly string $name,
        public readonly string $language,
        public readonly ?string $publisher = null,
        public readonly ?int $totalVolumes = null,
        public readonly bool $isFinished = false,
    ) {}
}
