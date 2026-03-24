<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Domain\Repositories\WishlistRepositoryInterface;

final class WishlistStatsAction
{
    public function __construct(
        private readonly WishlistRepositoryInterface $wishlistRepository,
    ) {}

    public function execute(int $userId): int
    {
        return $this->wishlistRepository->countTotalVolumesByUserId($userId);
    }
}
