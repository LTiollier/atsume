<?php

declare(strict_types=1);

namespace App\Borrowing\Application\DTOs;

final readonly class ReturnItemDTO
{
    public function __construct(
        public int $userId,
        public int $loanableId,
        public string $loanableType,
    ) {}
}
