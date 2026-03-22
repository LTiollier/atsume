<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class AddLocalVolumesDTO
{
    /**
     * @param  int[]  $numbers
     */
    public function __construct(
        public int $editionId,
        public array $numbers,
        public int $userId,
    ) {}
}
