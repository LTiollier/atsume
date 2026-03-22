<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class PlanningFiltersDTO
{
    public function __construct(
        public int $userId,
        public string $from,
        public string $to,
        public int $perPage,
        public ?string $cursor,
    ) {}
}
