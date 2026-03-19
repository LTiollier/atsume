<?php

namespace App\Manga\Infrastructure\Services;

use App\Manga\Infrastructure\EloquentModels\Box as EloquentBox;
use App\Manga\Infrastructure\EloquentModels\Edition as EloquentEdition;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Gate;
use InvalidArgumentException;

class WishlistAuthorizationService
{
    /**
     * @throws AuthorizationException
     */
    public function authorizeAdd(int $wishlistableId, string $wishlistableType): void
    {
        match ($wishlistableType) {
            'edition' => Gate::authorize('addEdition', EloquentEdition::findOrFail($wishlistableId)),
            'box' => Gate::authorize('addBox', EloquentBox::findOrFail($wishlistableId)),
            default => throw new InvalidArgumentException('Invalid wishlistable type: '.$wishlistableType),
        };
    }
}
