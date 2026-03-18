<?php

namespace App\Borrowing\Application\DTOs;

class ReturnItemDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly int $loanableId,
        public readonly string $loanableType,
    ) {}
}
