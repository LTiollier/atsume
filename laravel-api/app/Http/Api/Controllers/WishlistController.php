<?php

namespace App\Http\Api\Controllers;

use App\Http\Api\Requests\AddToWishlistRequest;
use App\Http\Api\Requests\RemoveFromWishlistRequest;
use App\Http\Api\Resources\WishlistItemResource;
use App\Manga\Application\Actions\AddToWishlistAction;
use App\Manga\Application\Actions\ListWishlistAction;
use App\Manga\Application\Actions\RemoveVolumeFromWishlistAction;
use App\Manga\Application\DTOs\AddToWishlistDTO;
use App\Manga\Infrastructure\Services\WishlistAuthorizationService;
use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WishlistController
{
    public function index(Request $request, ListWishlistAction $action): AnonymousResourceCollection
    {
        /** @var User $user */
        $user = $request->user();
        $wishlist = $action->execute((int) $user->id);

        return WishlistItemResource::collection($wishlist);
    }

    public function store(
        AddToWishlistRequest $request,
        AddToWishlistAction $action,
        WishlistAuthorizationService $authService,
    ): JsonResponse {
        /** @var User $user */
        $user = $request->user();

        $wishlistId = $request->integer('wishlist_id');
        $wishlistType = $request->string('wishlist_type')->toString();

        $authService->authorizeAdd($wishlistId, $wishlistType);

        $dto = new AddToWishlistDTO(
            userId: (int) $user->id,
            wishlistableId: $wishlistId,
            wishlistableType: $wishlistType,
        );

        $item = $action->execute($dto);

        return (new WishlistItemResource($item))->response()->setStatusCode(201);
    }

    public function destroy(RemoveFromWishlistRequest $request, RemoveVolumeFromWishlistAction $action, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $type = $request->string('wishlist_type')->toString();
        $action->execute($id, $type, (int) $user->id);

        return response()->json(['message' => 'Item removed from wishlist'], 200);
    }
}
