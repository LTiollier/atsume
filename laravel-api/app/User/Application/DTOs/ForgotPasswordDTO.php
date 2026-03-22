<?php

declare(strict_types=1);

namespace App\User\Application\DTOs;

final class ForgotPasswordDTO
{
    public function __construct(
        public readonly string $email,
    ) {}
}
