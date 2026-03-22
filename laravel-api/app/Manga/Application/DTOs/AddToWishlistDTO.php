<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

class AddToWishlistDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly int $wishlistableId,
        public readonly string $wishlistableType,
    ) {}
}
