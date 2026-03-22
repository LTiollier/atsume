<?php

declare(strict_types=1);

namespace App\User\Application\DTOs;

final class UpdatePasswordDTO
{
    public function __construct(
        public readonly string $currentPassword,
        public readonly string $newPassword
    ) {}
}
