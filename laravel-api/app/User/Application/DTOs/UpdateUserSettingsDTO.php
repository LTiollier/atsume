<?php

declare(strict_types=1);

namespace App\User\Application\DTOs;

class UpdateUserSettingsDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $username,
        public readonly bool $isPublic,
        public readonly string $theme,
        public readonly string $palette,
    ) {}
}
