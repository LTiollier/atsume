<?php

declare(strict_types=1);

namespace App\Manga\Domain\Listeners;

use App\Manga\Domain\Events\EditionAddedToCollection;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;

final class RemoveEditionFromWishlistOnCollection
{
    public function __construct(
        private readonly WishlistRepositoryInterface $wishlistRepository
    ) {}

    public function handle(EditionAddedToCollection $event): void
    {
        $this->wishlistRepository->removeWishlistItemFromUser($event->editionId, 'edition', $event->userId);
    }
}
