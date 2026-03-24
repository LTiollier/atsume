<?php

declare(strict_types=1);

namespace App\Http\Api\Controllers;

use App\Http\Api\Resources\PublicUserResource;
use App\Http\Api\Resources\VolumeResource;
use App\Manga\Application\Actions\ListUserVolumesAction;
use App\User\Application\Actions\GetPublicUserAction;
use App\User\Domain\Exceptions\ProfileNotFoundOrPrivateException;
use Illuminate\Http\JsonResponse;

class PublicProfileController
{
    public function showProfile(string $username, GetPublicUserAction $action): JsonResponse
    {
        try {
            $user = $action->execute($username);

            return (new PublicUserResource($user))->response()->setStatusCode(200);
        } catch (ProfileNotFoundOrPrivateException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function showCollection(string $username, GetPublicUserAction $getPublicUserAction, ListUserVolumesAction $listUserMangasAction): JsonResponse
    {
        try {
            $user = $getPublicUserAction->execute($username);

            $userId = $user->getId();
            if ($userId === null) {
                return response()->json(['message' => 'Profile not found or is private.'], 404);
            }

            $mangas = $listUserMangasAction->execute($userId);

            return VolumeResource::collection(collect($mangas))->response()->setStatusCode(200);
        } catch (ProfileNotFoundOrPrivateException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
