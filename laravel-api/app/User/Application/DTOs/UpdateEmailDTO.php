<?php

declare(strict_types=1);

namespace App\User\Application\DTOs;

class UpdateEmailDTO
{
    public function __construct(
        public readonly string $email,
        public readonly string $currentPassword
    ) {}
}
