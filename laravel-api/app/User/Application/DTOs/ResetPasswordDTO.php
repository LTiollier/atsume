<?php

declare(strict_types=1);

namespace App\User\Application\DTOs;

final readonly class ResetPasswordDTO
{
    public function __construct(
        public string $email,
        public string $password,
        public string $passwordConfirmation,
        public string $token,
    ) {}
}
