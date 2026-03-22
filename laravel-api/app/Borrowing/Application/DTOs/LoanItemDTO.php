<?php

declare(strict_types=1);

namespace App\Borrowing\Application\DTOs;

final class LoanItemDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly int $loanableId,
        public readonly string $loanableType,
        public readonly string $borrowerName,
        public readonly ?string $notes = null,
    ) {}
}
