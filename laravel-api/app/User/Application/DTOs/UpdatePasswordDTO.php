<?php

declare(strict_types=1);

namespace App\User\Application\DTOs;

final readonly class UpdatePasswordDTO
{
    public function __construct(
        public string $currentPassword,
        public string $newPassword
    ) {}
}
