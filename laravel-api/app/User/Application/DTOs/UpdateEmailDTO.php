<?php

namespace App\User\Application\DTOs;

class UpdateEmailDTO
{
    public function __construct(
        public readonly string $email,
        public readonly string $currentPassword
    ) {}
}
