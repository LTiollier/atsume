<?php

declare(strict_types=1);

namespace App\Manga\Infrastructure\Policies;

use App\Manga\Infrastructure\EloquentModels\Box;
use App\Manga\Infrastructure\EloquentModels\Edition;
use App\User\Infrastructure\EloquentModels\User;

class WishlistPolicy
{
    /**
     * L'utilisateur ne peut pas ajouter une édition à sa wishlist
     * s'il possède déjà au moins un tome de cette édition.
     */
    public function addEdition(User $user, Edition $edition): bool
    {
        return ! $edition->volumes()
            ->whereHas('users', fn ($q) => $q->where('users.id', $user->id))
            ->exists();
    }

    /**
     * L'utilisateur ne peut pas ajouter un coffret à sa wishlist
     * s'il le possède déjà.
     */
    public function addBox(User $user, Box $box): bool
    {
        return ! $box->users()->where('users.id', $user->id)->exists();
    }
}
