<?php

declare(strict_types=1);

namespace App\Borrowing\Application\DTOs;

final class BulkLoanMangaDTO
{
    /**
     * @param  int[]  $volumeIds
     */
    public function __construct(
        public readonly int $userId,
        public readonly array $volumeIds,
        public readonly string $borrowerName,
        public readonly ?string $notes = null,
    ) {}
}
