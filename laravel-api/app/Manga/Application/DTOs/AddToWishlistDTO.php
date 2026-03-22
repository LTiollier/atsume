<?php

declare(strict_types=1);

namespace App\Manga\Application\DTOs;

final readonly class AddToWishlistDTO
{
    public function __construct(
        public int $userId,
        public int $wishlistableId,
        public string $wishlistableType,
    ) {}
}
