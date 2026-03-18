<?php

namespace App\Manga\Infrastructure\Services;

use App\Manga\Infrastructure\EloquentModels\Box as EloquentBox;
use App\Manga\Infrastructure\EloquentModels\Edition as EloquentEdition;
use App\Manga\Infrastructure\EloquentModels\Volume as EloquentVolume;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Gate;

class WishlistAuthorizationService
{
    /**
     * @throws AuthorizationException
     */
    public function authorizeAddEdition(int $editionId): void
    {
        $edition = EloquentEdition::findOrFail($editionId);
        Gate::authorize('addEdition', $edition);
    }

    /**
     * Résout le type de l'item à partir de son api_id et vérifie
     * que l'utilisateur n'en possède pas déjà un exemplaire.
     *
     * @throws AuthorizationException
     */
    public function authorizeAddByApiId(string $apiId): void
    {
        $volume = EloquentVolume::where('api_id', $apiId)->with('edition')->first();
        if ($volume?->edition) {
            Gate::authorize('addEdition', $volume->edition);

            return;
        }

        $box = EloquentBox::where('api_id', $apiId)->first();
        if ($box) {
            Gate::authorize('addBox', $box);
        }
    }
}
