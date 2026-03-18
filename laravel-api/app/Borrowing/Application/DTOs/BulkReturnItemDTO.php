<?php

namespace App\Borrowing\Application\DTOs;

class BulkReturnItemDTO
{
    /**
     * @param  array<array{id: int, type: string}>  $items
     */
    public function __construct(
        public readonly int $userId,
        public readonly array $items,
    ) {}
}
