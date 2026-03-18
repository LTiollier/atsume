<?php

namespace App\Http\Api\Controllers;

use App\Http\Api\Requests\RemoveFromWishlistRequest;
use App\Http\Api\Requests\ScanMangaRequest;
use App\Http\Api\Resources\WishlistItemResource;
use App\Manga\Application\Actions\AddEditionToWishlistAction;
use App\Manga\Application\Actions\AddScannedMangaToWishlistAction;
use App\Manga\Application\Actions\AddWishlistItemAction;
use App\Manga\Application\Actions\ListWishlistAction;
use App\Manga\Application\Actions\RemoveVolumeFromWishlistAction;
use App\Manga\Application\DTOs\AddWishlistItemDTO;
use App\Manga\Infrastructure\EloquentModels\Box as EloquentBox;
use App\Manga\Infrastructure\EloquentModels\Edition as EloquentEdition;
use App\Manga\Infrastructure\EloquentModels\Volume as EloquentVolume;
use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class WishlistController
{
    public function index(Request $request, ListWishlistAction $action): AnonymousResourceCollection
    {
        /** @var User $user */
        $user = $request->user();
        $wishlist = $action->execute((int) $user->id);

        return WishlistItemResource::collection($wishlist);
    }

    public function store(Request $request, AddWishlistItemAction $action, AddEditionToWishlistAction $editionAction): JsonResponse
    {
        $request->validate([
            'api_id' => ['sometimes', 'string'],
            'edition_id' => ['sometimes', 'integer'],
        ]);

        if (! $request->has('api_id') && ! $request->has('edition_id')) {
            return response()->json(['message' => 'api_id or edition_id is required'], 422);
        }

        /** @var User $user */
        $user = $request->user();

        if ($request->has('edition_id')) {
            $edition = EloquentEdition::findOrFail((int) $request->input('edition_id'));
            Gate::authorize('addEdition', $edition);
            $item = $editionAction->execute((int) $request->input('edition_id'), (int) $user->id);
        } else {
            $apiId = $request->string('api_id')->toString();
            $this->authorizeApiIdWishlist($apiId);

            $dto = new AddWishlistItemDTO(api_id: $apiId, userId: (int) $user->id);
            $item = $action->execute($dto);
        }

        return (new WishlistItemResource($item))->response()->setStatusCode(201);
    }

    private function authorizeApiIdWishlist(string $apiId): void
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

    public function scan(ScanMangaRequest $request, AddScannedMangaToWishlistAction $action): JsonResponse
    {
        $dto = $request->toDTO();
        $edition = $action->execute($dto);

        return (new WishlistItemResource($edition))->response()->setStatusCode(201);
    }

    public function destroy(RemoveFromWishlistRequest $request, RemoveVolumeFromWishlistAction $action, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $type = $request->input('type', 'edition');
        $action->execute($id, $type, (int) $user->id);

        return response()->json(['message' => 'Item removed from wishlist'], 200);
    }
}
