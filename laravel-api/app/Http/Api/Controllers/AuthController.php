<?php

declare(strict_types=1);

namespace App\Http\Api\Controllers;

use App\Http\Api\Requests\ForgotPasswordRequest;
use App\Http\Api\Requests\LoginRequest;
use App\Http\Api\Requests\RegisterRequest;
use App\Http\Api\Requests\ResetPasswordRequest;
use App\Http\Api\Requests\VerifyEmailRequest;
use App\Http\Api\Resources\UserResource;
use App\User\Application\Actions\ForgotPasswordAction;
use App\User\Application\Actions\LoginAction;
use App\User\Application\Actions\LogoutAction;
use App\User\Application\Actions\RegisterUserAction;
use App\User\Application\Actions\ResetPasswordAction;
use App\User\Application\Actions\SendVerificationNotificationAction;
use App\User\Application\Actions\VerifyEmailAction;
use App\User\Domain\Exceptions\EmailAlreadyVerifiedException;
use App\User\Domain\Exceptions\InvalidCredentialsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

final class AuthController
{
    public function register(RegisterRequest $request, RegisterUserAction $action): JsonResponse
    {
        $dto = $request->toDTO();

        $result = $action->execute($dto);

        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 201);
    }

    public function login(LoginRequest $request, LoginAction $action): JsonResponse
    {
        try {
            $dto = $request->toDTO();

            $result = $action->execute($dto);

            return response()->json([
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ]);
        } catch (InvalidCredentialsException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 401);
        }
    }

    public function logout(Request $request, LogoutAction $action): JsonResponse
    {
        /** @var string|int|null $userId */
        $userId = $request->user()?->getAuthIdentifier();
        $action->execute(intval($userId));

        return response()->json([
            'message' => 'Successfully logged out.',
        ]);
    }

    public function verify(VerifyEmailRequest $request, VerifyEmailAction $action): JsonResponse|RedirectResponse
    {
        /** @var string|null $id */
        $id = $request->route('id');

        $action->execute(intval($id));

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Email verified successfully.']);
        }

        /** @var string $frontendUrl */
        $frontendUrl = config('app.frontend_url');

        return redirect($frontendUrl.'/dashboard?verified=1');
    }

    public function sendVerificationNotification(Request $request, SendVerificationNotificationAction $action): JsonResponse
    {
        try {
            /** @var string|int|null $userId */
            $userId = $request->user()?->getAuthIdentifier();
            $action->execute(intval($userId));

            return response()->json(['message' => 'Verification link sent.']);
        } catch (EmailAlreadyVerifiedException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function forgotPassword(ForgotPasswordRequest $request, ForgotPasswordAction $action): JsonResponse
    {
        $status = $action->execute($request->toDTO());

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    public function resetPassword(ResetPasswordRequest $request, ResetPasswordAction $action): JsonResponse
    {
        $status = $action->execute($request->toDTO());

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }
}
