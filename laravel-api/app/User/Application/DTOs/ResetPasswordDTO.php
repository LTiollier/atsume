<?php

declare(strict_types=1);

namespace App\User\Application\DTOs;

final class ResetPasswordDTO
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly string $passwordConfirmation,
        public readonly string $token,
    ) {}
}
