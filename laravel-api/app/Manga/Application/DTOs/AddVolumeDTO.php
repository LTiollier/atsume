<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class AddVolumeDTO
{
    public function __construct(
        public string $api_id,
        public int $userId,
    ) {}
}
