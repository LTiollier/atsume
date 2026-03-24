<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Domain\Exceptions\VolumeNotFoundException;
use App\Manga\Domain\Models\Box;
use App\Manga\Domain\Repositories\BoxRepositoryInterface;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;

class AddBoxToWishlistAction
{
    public function __construct(
        private readonly BoxRepositoryInterface $boxRepository,
        private readonly WishlistRepositoryInterface $wishlistRepository
    ) {}

    public function execute(int $boxId, int $userId): Box
    {
        $box = $this->boxRepository->findById($boxId, $userId);
        if (! $box) {
            throw new VolumeNotFoundException('Box not found with ID: '.$boxId);
        }

        $this->wishlistRepository->addBoxWishlistToUser($boxId, $userId);

        return $box;
    }
}
