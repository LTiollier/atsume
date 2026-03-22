<?php

declare(strict_types=1);

namespace App\Manga\Infrastructure\Repositories;

use App\Manga\Domain\Models\Box;
use App\Manga\Domain\Models\Edition;
use App\Manga\Domain\Repositories\WishlistRepositoryInterface;
use App\Manga\Infrastructure\EloquentModels\Box as EloquentBox;
use App\Manga\Infrastructure\EloquentModels\Edition as EloquentEdition;
use App\Manga\Infrastructure\Mappers\BoxMapper;
use App\Manga\Infrastructure\Mappers\EditionMapper;
use App\User\Infrastructure\EloquentModels\User as EloquentUser;

class EloquentWishlistRepository implements WishlistRepositoryInterface
{
    public function addEditionWishlistToUser(int $editionId, int $userId): void
    {
        $user = EloquentUser::findOrFail($userId);
        $user->wishlistEditions()->syncWithoutDetaching([$editionId]);
    }

    public function addBoxWishlistToUser(int $boxId, int $userId): void
    {
        $user = EloquentUser::findOrFail($userId);
        $user->wishlistBoxes()->syncWithoutDetaching([$boxId]);
    }

    public function removeWishlistItemFromUser(int $itemId, string $type, int $userId): void
    {
        $user = EloquentUser::findOrFail($userId);

        if ($type === 'edition') {
            $user->wishlistEditions()->detach($itemId);
        } else {
            $user->wishlistBoxes()->detach($itemId);
        }
    }

    /**
     * @return array<Edition|Box>
     */
    public function findWishlistByUserId(int $userId): array
    {
        $user = EloquentUser::findOrFail($userId);

        /** @var array<Edition> $editions */
        $editions = $user->wishlistEditions()
            ->with(['series', 'firstVolume'])
            ->withCount(['volumes as possessed_volumes_count' => function ($v) use ($userId) {
                $v->whereHas('users', fn ($u) => $u->where('users.id', $userId));
            }])
            ->get()
            ->map(fn (EloquentEdition $e) => EditionMapper::toDomain($e, isWishlisted: true))
            ->all();

        /** @var array<Box> $boxes */
        $boxes = $user->wishlistBoxes()
            ->with('boxSet.series')
            ->withExists(['users as is_owned' => function ($u) use ($userId) {
                $u->where('users.id', $userId);
            }])
            ->get()
            ->map(fn (EloquentBox $b) => BoxMapper::toDomain($b, isWishlisted: true))
            ->all();

        return array_merge($editions, $boxes);
    }
}
