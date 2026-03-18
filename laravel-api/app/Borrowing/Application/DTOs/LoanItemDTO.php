<?php

namespace App\Borrowing\Application\DTOs;

class LoanItemDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly int $loanableId,
        public readonly string $loanableType,
        public readonly string $borrowerName,
        public readonly ?string $notes = null,
    ) {}
}
