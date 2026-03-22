<?php

declare(strict_types=1);

namespace App\User\Application\DTOs;

final readonly class RegisterUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}
}
