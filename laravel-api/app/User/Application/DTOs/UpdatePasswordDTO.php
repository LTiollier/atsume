<?php

namespace App\User\Application\DTOs;

class UpdatePasswordDTO
{
    public function __construct(
        public readonly string $currentPassword,
        public readonly string $newPassword
    ) {}
}
