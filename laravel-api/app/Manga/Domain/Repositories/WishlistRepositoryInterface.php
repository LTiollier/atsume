<?php

declare(strict_types=1);

namespace App\Manga\Domain\Repositories;

use App\Manga\Domain\Models\Box;
use App\Manga\Domain\Models\Edition;

interface WishlistRepositoryInterface
{
    public function addEditionWishlistToUser(int $editionId, int $userId): void;

    public function addBoxWishlistToUser(int $boxId, int $userId): void;

    public function removeWishlistItemFromUser(int $itemId, string $type, int $userId): void;

    /**
     * @return array<Edition|Box>
     */
    public function findWishlistByUserId(int $userId): array;
}
