<?php

declare(strict_types=1);

namespace App\Http\Api\Controllers;

use App\Http\Api\Requests\UpdateEmailRequest;
use App\Http\Api\Requests\UpdatePasswordRequest;
use App\Http\Api\Requests\UpdateUserSettingsRequest;
use App\Http\Api\Resources\UserResource;
use App\User\Application\Actions\UpdateEmailAction;
use App\User\Application\Actions\UpdatePasswordAction;
use App\User\Application\Actions\UpdateUserSettingsAction;
use App\User\Domain\Exceptions\InvalidCredentialsException;
use App\User\Infrastructure\EloquentModels\User as EloquentUser;
use Illuminate\Http\JsonResponse;

/** @property EloquentUser $user */
class UserSettingsController
{
    public function update(UpdateUserSettingsRequest $request, UpdateUserSettingsAction $action): UserResource
    {
        $dto = $request->toDTO();

        $updatedUser = $action->execute($dto);

        return new UserResource($updatedUser);
    }

    public function updateEmail(UpdateEmailRequest $request, UpdateEmailAction $action): JsonResponse|UserResource
    {
        try {
            /** @var EloquentUser $user */
            $user = $request->user();

            $dto = $request->toDTO();

            $updatedUser = $action->execute($dto, $user->id);

            return new UserResource($updatedUser);
        } catch (InvalidCredentialsException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 401);
        }
    }

    public function updatePassword(UpdatePasswordRequest $request, UpdatePasswordAction $action): JsonResponse|UserResource
    {
        try {
            /** @var EloquentUser $user */
            $user = $request->user();

            $dto = $request->toDTO();

            $updatedUser = $action->execute($dto, $user->id);

            return new UserResource($updatedUser);
        } catch (InvalidCredentialsException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 401);
        }
    }
}
