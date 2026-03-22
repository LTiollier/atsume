<?php

declare(strict_types=1);

namespace App\User\Application\DTOs;

final readonly class LoginDTO
{
    public function __construct(
        public string $email,
        public string $password,
    ) {}
}
