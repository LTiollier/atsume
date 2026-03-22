<?php

declare(strict_types=1);

namespace App\Borrowing\Application\DTOs;

final readonly class BulkReturnItemDTO
{
    /**
     * @param  array<array{id: int, type: string}>  $items
     */
    public function __construct(
        public int $userId,
        public array $items,
    ) {}
}
