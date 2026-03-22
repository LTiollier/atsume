<?php

declare(strict_types=1);

namespace App\Manga\Domain\Listeners;

use App\Manga\Domain\Events\BoxAddedToCollection;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;

final class RemoveBoxFromWishlistOnCollection
{
    public function __construct(
        private readonly WishlistRepositoryInterface $wishlistRepository
    ) {}

    public function handle(BoxAddedToCollection $event): void
    {
        $this->wishlistRepository->removeWishlistItemFromUser($event->boxId, 'box', $event->userId);
    }
}
